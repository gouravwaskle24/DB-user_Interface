import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { any, z } from "zod";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { Card, CardContent } from "components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { useState } from "react";
import { data_types } from "lib/utils";
import { CirclePlus } from "lucide-react";
import { AttributeTable } from "../Tables/attribute-table";
import { AnimatePresence, motion } from "framer-motion";
import { createTable } from "helper/helper";
import { useToast } from "components/ui/use-toast";
import { useModal } from "provider/ModalProvider";

type props = {
  tablenames: string[];
};

//Form is for creating a entity (new table)


export function CreateEntityForm({ tablenames }: props) {
  const { toast } = useToast();
  const [CardOpen, setCardOpen] = useState<boolean>(true);
  const [dataTypeValue, setdataTypeValue] = useState("");
  const [requiredValue, setrequiredValue] = useState("false");
  const [attributes, setAttributes] = useState<attributes>({});

  const totalAttributes: number = Object.keys(attributes).length;

  const { setClose } = useModal();

  const formSchema = z
    .object({
      entityName: z
        .string()
        .min(2, {
          message: "Entityname must be at required.",
        })
        .refine(
          (entityName) => !tablenames.includes(entityName),
          "Entity name already exists"
        ),
      attributes: z.string().optional(),
    })
    .refine(
      () => {
        if (totalAttributes === 0) {
          return false;
        }
        return true;
      },
      {
        message: "Add atleast one attribute",
        path: ["attributes"],
      }
    );

  const formSchema1 = z
    .object({
      attributeName: z.string().min(1, {
        message: "attribute name must be required",
      }),
      datatype: z.string(),
      required: z.boolean().optional(),
    })
    .refine(
      () => {
        if (dataTypeValue === "") {
          return false;
        }
        return true;
      },
      {
        message: "Select a data type",
        path: ["datatype"],
      }
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entityName: "",
      attributes: "",
    },
  });

  const isLoading = form.formState.isLoading;

  const form1 = useForm<z.infer<typeof formSchema1>>({
    resolver: zodResolver(formSchema1),
    defaultValues: {
      datatype: "",
      attributeName: "",
      required: true,
    },
  });

  type attributes = {
    [key: string]: {
      type: string;
      required: boolean;
    };
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values.entityName);

    const response = await createTable(values.entityName, attributes);
    console.log("response", response);

    toast({
      title: "Success!",
      description: "New entity has created successfully",
    });

    setClose();
    window.location.reload();
  };

  const onSubmitAttribute = (values: z.infer<typeof formSchema1>) => {
    console.log("requiredValue", requiredValue, typeof requiredValue);
    const newAttribute = {
      type: dataTypeValue,
      required: requiredValue == "true", // Converts string "true" to boolean true
    };
    console.log("req", values.required);

    setAttributes((prevAttributes) => ({
      ...prevAttributes,
      [values.attributeName.split(" ").join("")]: newAttribute,
    }));
    setCardOpen(false);
    setrequiredValue("true");
    setdataTypeValue("");
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8  ">
          <FormField
            control={form.control}
            name="entityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entity Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a entity name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {totalAttributes !== 0 && (
            <>
              <div className=" w-full flex justify-end items-center">
                <Button
                  type="button"
                  size={"sm"}
                  className="gap-2"
                  onClick={() => setCardOpen((prev) => !prev)}
                >
                  <span>Add attributes</span> <CirclePlus size={18} />
                </Button>
              </div>
              <AttributeTable attributes={attributes} />
            </>
          )}
          <FormField
            control={form.control}
            name="attributes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>attributes</FormLabel>
                <FormControl>
                  <AnimatePresence>
                    {CardOpen && (
                      <div className="flex flex-col  justify-center items-start gap-2">
                        {totalAttributes === 0 && (
                          <div className="text-sm text-muted-foreground">
                            Add atleast one attribute to create a entity
                          </div>
                        )}
                        <motion.div
                          key={"box"}
                          initial={{ y: "50%", opacity: 0, scale: 0.5 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{
                            y: 0,
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="w-full"
                        >
                          <Card className="w-full justify-center items-center">
                            <CardContent>
                              <Form {...form1}>
                                <form
                                  onSubmit={form1.handleSubmit(
                                    onSubmitAttribute
                                  )}
                                  className=" space-y-8"
                                >
                                  <FormField
                                    control={form1.control}
                                    name="attributeName"
                                    render={({ field }) => (
                                      <FormItem className="mt-1">
                                        <FormLabel>Attribute</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Enter a attribute name"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form1.control}
                                    name="datatype"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Datatype</FormLabel>
                                        <FormControl>
                                          <Select
                                            onValueChange={setdataTypeValue}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue
                                                placeholder={
                                                  <span className="text-slate-400">
                                                    Select a datatype
                                                  </span>
                                                }
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                {data_types.map((data) => (
                                                  <SelectItem
                                                    value={data.value}
                                                  >
                                                    {data.name}
                                                  </SelectItem>
                                                ))}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form1.control}
                                    name="required"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Required</FormLabel>
                                        <FormControl>
                                          <Select
                                            onValueChange={setrequiredValue}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue
                                                placeholder={
                                                  <span className="text-slate-400">
                                                    Select required or not
                                                  </span>
                                                }
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectItem value={"true"}>
                                                  Yes
                                                </SelectItem>
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="flex items-end justify-end">
                                    <Button
                                      type="button"
                                      onClick={form1.handleSubmit(
                                        onSubmitAttribute
                                      )}
                                      className="text"
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </form>
                              </Form>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-20 mt-4" disabled={isLoading} type="submit">
            {form.formState.isSubmitting ? (
              <div className="animate-spin " />
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
export default CreateEntityForm;
