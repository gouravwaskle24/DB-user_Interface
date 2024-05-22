import React, { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import clsx from "clsx";
import { Menu, Plus, PlusCircleIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import CustomModal from "./Custom-modal";
import { useModal } from "provider/ModalProvider";
import CreateEntityForm from "./Forms/Create-entity-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Separator } from "./ui/separator";
import { getTables } from "helper/helper";
import { NavLink } from "react-router-dom";

type Props = {
  defaultOpen?: boolean;
};

const LeftSideOptions = ({ defaultOpen }: Props) => {
  const { setOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const [tablesData, settablesData] = useState<any>([]);

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTables();
        settablesData(data);
        console.log(" table names", data);
      } catch (error) {
        console.error("Error fetching tables data:", error);
      }
    };

    fetchData();
  }, []);

  //   useEffect(() => {
  //     setIsMounted(true);
  //   }, []);

  //   if (!isMounted) return;

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] md:!hidden flex"
      >
        <Button variant="outline" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side={"left"}
        className={clsx(
          "bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6  ",
          {
            "hidden md:inline-block z-0 w-[300px] mt-12": defaultOpen,
            "inline-block md:hidden z-[100] w-full  ": !defaultOpen,
          }
        )}
      >
        <SheetHeader className="w-full flex flex-row justify-between items-center mb-5">
          <div className="text-3xl font-extrabold">Entities</div>

          <Button
            className={twMerge(" flex gap-2")}
            onClick={() => {
              setOpen(
                <CustomModal title="Create a new Entity" subheading="">
                  <CreateEntityForm tablenames={tablesData} />
                </CustomModal>
              );
            }}
          >
            <PlusCircleIcon size={15} />
            Create new
          </Button>
        </SheetHeader>

        <p className="text-muted-foreground  mt-16"> EXISTING ENTITIES</p>
        <Separator className="mb-5 mt-1" />
        <nav className="relative">
          <Command className="rounded-lg overflow-visible bg-transparent">
            <CommandInput placeholder="Search..." />
            <CommandList className="py-4 overflow-visible">
              <CommandEmpty>No Results Found</CommandEmpty>
              <CommandGroup className="overflow-visible">
                {tablesData?.map((table: string) => {
                  return (
                    <CommandItem key={table} className=" w-full">
                      <NavLink
                        to={`/dashboard/${table}`}
                        state={{ table: table }}
                        className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px] font-semibold text-[15px]"
                      >
                        <span className="capitalize">{table}</span>
                      </NavLink>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default LeftSideOptions;
