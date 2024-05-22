import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Switch } from "components/ui/switch";
import { useToast } from "components/ui/use-toast";
import { addDataTotable } from "helper/helper";
import { useModal } from "provider/ModalProvider";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Attribute = {
  type: string;
  allowNull: boolean;
  defaultValue: any;
};

type Props = {
  tablename: string;
  tableData: Attribute;
};

// Form to add the row intp the table  this is a dynamic table which handles all fields as table changes

const AddDataForm = ({ tablename, tableData }: Props) => {
  const { setClose } = useModal();
  const { toast } = useToast();

  const formSchema = React.useMemo(() => {
    const schema = z.object(
      Object.entries(tableData)
        .filter(([key]) => !["id", "updatedAt", "createdAt"].includes(key))
        .reduce((acc, [key, value]) => {
          const { type, allowNull } = value;
          let zodType;

          switch (type) {
            case "INT":
            case "FLOAT":
              zodType = allowNull
                ? z
                    .number()
                    .nullable()
                    .optional()
                    .or(z.number().min(1, { message: `${key} is required` }))
                : z.number().min(1, { message: `${key} is required` });
              break;
            case "VARCHAR":
            case "TEXT":
              zodType = allowNull
                ? z
                    .string()
                    .nullable()
                    .optional()
                    .or(z.string().min(1, { message: `${key} is required` }))
                : z.string().min(1, { message: `${key} is required` });
              break;
            case "BOOLEAN":
            case "TINYINT":
              zodType = z.boolean().default(false);
              break;
            case "DATE":
            case "DATETIME":
              zodType = allowNull
                ? z
                    .date()
                    .nullable()
                    .optional()
                    .or(z.date({ required_error: `${key} is required` }))
                : z.date({ required_error: `${key} is required` });
              break;
            default:
              zodType = allowNull
                ? z
                    .string()
                    .nullable()
                    .optional()
                    .or(z.string().min(1, { message: `${key} is required` }))
                : z.string().min(1, { message: `${key} is required` });
          }

          acc[key] = zodType;
          return acc;
        }, {} as Record<string, z.ZodType>)
    );

    return schema;
  }, [tableData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.fromEntries(
      Object.entries(tableData)
        .filter(([key]) => !["id", "updatedAt", "createdAt"].includes(key))
        .map(([key, value]) => {
          const { type, defaultValue } = value;
          if (type === "BOOLEAN" || type === "TINYINT") {
            return [key, defaultValue === undefined ? false : false];
          }
          return [key, defaultValue];
        })
    ),
  });
  const isLoading = form.formState.isLoading;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const response = await addDataTotable(tablename, value);

    toast({
      title: "Success!",
      description: "New data added successfully",
    });

    setClose();
    window.location.reload();
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {Object.entries(tableData)
            .filter(([key]) => !["id", "updatedAt", "createdAt"].includes(key))
            .map(([attributeName, attributeDetails]) => {
              return (
                <FormField
                  key={attributeName}
                  control={form.control}
                  name={attributeName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{attributeName}</FormLabel>
                      <FormControl>
                        {attributeDetails.type.includes("VARCHAR") ||
                        attributeDetails.type.includes("TEXT") ? (
                          <Input
                            placeholder={`Enter  ${attributeName}`}
                            {...field}
                          />
                        ) : attributeDetails.type.includes("BOOLEAN") ||
                          attributeDetails.type.includes("TINYINT") ||
                          attributeDetails.type.includes("TINYINT(0)") ||
                          attributeDetails.type.includes("TINYINT(1)") ? (
                          //   <Select
                          //     value={
                          //       field.value === true
                          //         ? "true"
                          //         : field.value === false
                          //         ? "false"
                          //         : ""
                          //     }
                          //     onValueChange={(value) =>
                          //       field.onChange(value === "true")
                          //     }
                          //   >
                          //     <SelectTrigger className="w-full">
                          //       <SelectValue placeholder={`${attributeName}`} />
                          //     </SelectTrigger>
                          //     <SelectContent>
                          //       <SelectGroup>
                          //         <SelectItem value={"1"}>True</SelectItem>
                          //       </SelectGroup>
                          //     </SelectContent>
                          //   </Select>
                          <Switch
                            checked={field.value === true}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                            // disabled={!attributeDetails.allowNull}
                            disabled={true}
                            aria-readonly={!attributeDetails.allowNull}
                          />
                        ) : attributeDetails.type.includes("INT") ||
                          attributeDetails.type.includes("FLOAT") ? (
                          <Input
                            value={field.value || ""}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                            type="number"
                            placeholder={`Enter ${attributeName}`}

                            // {...field}
                          />
                        ) : attributeDetails.type.includes("DATE") ||
                          attributeDetails.type.includes("DATETIME") ? (
                          <Input
                            type="datetime-local"
                            placeholder={`Enter ${attributeName}`}
                            {...field}
                          />
                        ) : (
                          <Input
                            placeholder={`Enter ${attributeName}`}
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          <div className="flex items-end justify-end">
            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? (
                <div className="animate-spin " />
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddDataForm;
