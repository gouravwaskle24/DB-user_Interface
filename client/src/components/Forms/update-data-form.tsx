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
import { useToast } from "components/ui/use-toast";
import { updatetableData } from "helper/helper";
import { useModal } from "provider/ModalProvider";
import React from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

type Props = {
  rowData: {};
  tablename: string;
};

// Form for update the row data

const UpdateDataForm = ({ rowData, tablename }: Props) => {
  const { setClose } = useModal();
  const { toast } = useToast();

  const formSchema = z.object(
    Object.entries(rowData)
      .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = z.string().optional();
        return acc;
      }, {} as Record<string, z.ZodType>)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.fromEntries(
      Object.entries(rowData).filter(
        ([key]) => !["id", "createdAt", "updatedAt"].includes(key)
      )
    ),
  });
  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //@ts-ignore
    await updatetableData(tablename, rowData.id, values);

    toast({
      title: "Success!",
      description: "updated data successfully",
    });

    setClose();

    window.location.reload();
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {Object.entries(rowData)
            .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
            .map(([key, value]) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{key}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={typeof value === "number" ? "number" : "text"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          <Button className="w-20 mt-4" disabled={isLoading} type="submit">
            {form.formState.isSubmitting ? (
              <div className="animate-spin " />
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateDataForm;
