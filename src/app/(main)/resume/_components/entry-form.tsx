"use client";
import { entryFormData, entrySchema } from "@/app/lib/schema/entrySchema";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Loader2,
  PlusCircleIcon,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { improveWithAi } from "@/actions/resume";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { MonthPicker } from "@/components/ui/month-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export type ResumeKeys = "Experience" | "Projects" | "Education";

interface EntryFormProps {
  type: ResumeKeys;
  entries: entryFormData[];
  onChange: (entries: entryFormData[]) => void;
}

export default function EntryForm({ type, entries, onChange }: EntryFormProps) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<entryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const formatDisplayDate = (dateString: string) => {
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  };

  const {
    loading: isImproving,
    fn: improveWithAiFn,
    data: improveContent,
    error: improveError,
  } = useFetch(improveWithAi);

  const handleAdd = handleValidation((data: entryFormData) => {
    const formattedData = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate || ""),
    };

    onChange([...entries, formattedData]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  useEffect(() => {
    if (improveContent && !isImproving) {
      setValue("description", improveContent);
      toast.success("Description improved successfully");
    }

    if (improveError) {
      toast.error("Failed to improve description");
      console.log("Error in improveWithAi : ", improveError.message);
    }
  }, [improveContent, improveError, isImproving]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAiFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item: entryFormData, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg text-primary font-semibold">
                {item.title} @ {item.organization}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-primary/80" htmlFor="title">
                  Title/Position
                </Label>
                <Input
                  id="title"
                  placeholder="Title/Position"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-primary/80" htmlFor="organization">
                  Organization/Company
                </Label>
                <Input
                  id="organization"
                  placeholder="Organization/Company"
                  {...register("organization")}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            {/* simple month picker */}

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-primary/80" htmlFor="startDate">
                  Start Date
                </Label>
                <Input id="startDate" type="month" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-primary/80" htmlFor="endDate">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                />

                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <div className="w-full">
                    <Label
                      htmlFor="start-date"
                      className="mb-2 block text-primary/80"
                    >
                      Start Date
                    </Label>
                    <Popover open={openStart} onOpenChange={setOpenStart}>
                      <PopoverTrigger asChild>
                        <div className="relative w-full">
                          <Input
                            id="start-date"
                            type="text"
                            value={
                              field.value
                                ? format(
                                    parse(field.value, "yyyy-MM", new Date()),
                                    "MMMM, yyyy"
                                  )
                                : ""
                            }
                            placeholder="Select Start Date (Month & Year)"
                            readOnly
                            className="pr-10 cursor-pointer"
                            onClick={() => setOpenStart(true)}
                          />
                          <CalendarIcon className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="flex items-center justify-center rounded-lg shadow-lg"
                        align="end"
                      >
                        <MonthPicker
                          selectedMonth={
                            field.value
                              ? parse(field.value, "yyyy-MM", new Date())
                              : undefined
                          }
                          onMonthSelect={(newDate) => {
                            setValue("startDate", format(newDate, "yyyy-MM"));
                            setOpenStart(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              />

              {/* End Date */}
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <div className="w-full">
                    <Label
                      htmlFor="end-date"
                      className="mb-2 block text-primary/80"
                    >
                      End Date
                    </Label>
                    <Popover open={openEnd} onOpenChange={setOpenEnd}>
                      <PopoverTrigger asChild>
                        <div className="relative w-full">
                          <Input
                            id="end-date"
                            type="text"
                            value={
                              field.value
                                ? format(
                                    parse(field.value, "yyyy-MM", new Date()),
                                    "MMMM, yyyy"
                                  )
                                : ""
                            }
                            placeholder="Select End Date (Month & Year)"
                            readOnly
                            className={`pr-10 ${
                              current
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                            onClick={() => {
                              if (!current) setOpenEnd(true); // Prevent opening when 'current' is selected
                            }}
                            disabled={current}
                          />
                          <CalendarIcon
                            className={`h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
          ${current ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          />
                        </div>
                      </PopoverTrigger>
                      {!current && (
                        <PopoverContent
                          className="flex items-center justify-center rounded-lg shadow-lg"
                          align="end"
                        >
                          <MonthPicker
                            selectedMonth={
                              field.value
                                ? parse(field.value, "yyyy-MM", new Date())
                                : undefined
                            }
                            onMonthSelect={(newDate) => {
                              setValue("endDate", format(newDate, "yyyy-MM"));
                              setOpenEnd(false);
                            }}
                          />
                        </PopoverContent>
                      )}
                    </Popover>
                  </div>
                )}
              />
              {/* End Date */}
              {/* <div className="space-y-2">
                <Label className="text-primary/80" htmlFor="endDate">
                  End Date
                </Label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <MonthPicker
                      selectedMonth={
                        field.value
                          ? parse(field.value, "yyyy-MM", new Date())
                          : undefined
                      }
                      onMonthSelect={(newDate) => {
                        setValue("endDate", format(newDate, "yyyy-MM"));
                      }}
                      style={
                        current
                          ? { pointerEvents: "none", opacity: 0.5 }
                          : undefined
                      } // Disable if "Current" checkbox is checked
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div> */}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                checked={current}
                onCheckedChange={(checked: boolean) => {
                  setValue("current", checked);
                  if (checked) setValue("endDate", "");
                }}
              />
              <Label className="text-primary/80" htmlFor="current">
                Current {type}
              </Label>
            </div>

            <div className="space-y-2">
              <Label className="text-primary/80" htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="h-32"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" /> Improve with AI
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAdd}
            >
              <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircleIcon className="h-4 w-4 mr-2" /> Add {type}
        </Button>
      )}
    </div>
  );
}
