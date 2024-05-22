import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { Select } from "components/ui/select";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {};

const formSchema1 = z.object({
  attributeName: z.string().min(1, {
    message: "attribute name must be required",
  }),
  datatype: z.string(),
});




const CreateAttributeForm = (props: Props) => {
  const form1 = useForm<z.infer<typeof formSchema1>>({
    resolver: zodResolver(formSchema1),
    defaultValues: {
      datatype: "",
      attributeName: "",
    },
  });

  const [CardOpen, setCardOpen] = useState<boolean>(false);

  console.log("cardopen", CardOpen);


  // optional

  const onSubmitAttribute = (values: z.infer<typeof formSchema1>) => {
    console.log(values);
  };
  return (
    <div className="flex  justify-center items-center">
      <Card className="w-full justify-center items-center">
        <CardContent>
          <Form {...form1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form1.handleSubmit(onSubmitAttribute)(e);
              }}
              className=" space-y-8  "
            >
              <FormField
                control={form1.control}
                name="attributeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attribute</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a attribute name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end justify-end">
                <Button type="submit">add</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAttributeForm;
