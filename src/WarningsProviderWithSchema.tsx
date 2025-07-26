import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { WarningsContext } from "./WarningsContext";

type Props = {
  schema: z.ZodSchema<any>;
  children: React.ReactNode;
};

export function WarningsProviderWithSchema({ schema, children }: Props) {
  const { watch } = useFormContext();
  const values = watch();
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  useEffect(() => {
    const result = schema.safeParse(values);

    if (result.success) {
      const warningMap: Record<string, string> = {};

      schema._def.effects?.forEach?.((eff: any) => {
        if (eff.type === "refinement") {
          const ctx: z.RefinementCtx = {
            addIssue(issue) {
              const key = issue.path.join(".");
              warningMap[key] = issue.message;
            },
            path: [],
          };
          eff.refinement(values, ctx);
        }
      });

      setWarnings(warningMap);
    } else {
      setWarnings({});
    }
  }, [values, schema]);

  return (
    <WarningsContext.Provider value={{ warnings }}>
      {children}
    </WarningsContext.Provider>
  );
}
