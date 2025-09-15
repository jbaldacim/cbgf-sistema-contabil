"use client";

import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import AccountSelector from "./AccountSelector";

type Entry = {
  id: string;
  accountId: string;
  amount: number;
};

interface EntriesCardProps {
  type: "debito" | "credito";
  title: string;
  description: string;
  entries: Entry[];
  addEntry: (type: "debito" | "credito") => void;
  updateEntry: (id: string, field: keyof Entry, value: string | number) => void;
  removeEntry: (id: string) => void;
  isAccountDuplicated: (accountId: string) => boolean;
  total: number;
}

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function EntriesCard({
  type,
  title,
  description,
  entries,
  addEntry,
  updateEntry,
  removeEntry,
  isAccountDuplicated,
  total,
}: EntriesCardProps) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div>
        <Card>
          <CardHeader className="bg-zinc-300 -mt-6 rounded-t-xl py-4">
            <CardTitle>{title}</CardTitle>
            <CardDescription className="text-zinc-800">
              {description}
            </CardDescription>
            <CardAction className="self-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => addEntry(type)}>
                    <Plus className="size-4 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adicionar conta</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col">
            <AnimatePresence initial={false} mode="sync">
              {entries.map((entry) => {
                const duplicated = isAccountDuplicated(entry.accountId);
                const showRemoveButton = entries.length > 1;

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{
                      opacity: 0,
                      height: 0,
                      transition: { duration: 0.3, ease: "easeInOut" },
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: { duration: 0.3, ease: "easeInOut" },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      scale: 0.95,
                      // x: 30,
                      transition: { duration: 0.3, ease: "easeInOut" },
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                      layout: { duration: 0.3, ease: "easeInOut" },
                    }}
                    className="flex flex-col gap-2 items-start overflow-hidden"
                  >
                    {/* Aqui o motion.div engloba AccountSelector + Remove Button */}
                    <div className="p-1 flex w-full">
                      <motion.div
                        layout
                        initial={{
                          opacity: 0,
                          y: -8,
                          scale: 0.95,
                          filter: "blur(4px)",
                          transition: { duration: 0.3, ease: "easeInOut" },
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: { duration: 0.3, ease: "easeInOut" },
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                          scale: 0.95,
                          filter: "blur(4px)",
                          transition: { duration: 0.3, ease: "easeInOut" },
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex w-full gap-2 items-start flex-1"
                      >
                        <AccountSelector
                          value={entry.accountId}
                          onChange={(value) =>
                            updateEntry(entry.id, "accountId", value)
                          }
                          amount={entry.amount.toString()}
                          onAmountChange={(value) =>
                            updateEntry(
                              entry.id,
                              "amount",
                              parseFloat(value) || 0
                            )
                          }
                          className={cn(duplicated && "border-destructive")}
                          onRemove={() => removeEntry(entry.id)}
                          showRemoveButton={showRemoveButton}
                        />

                        <AnimatePresence>
                          {duplicated && entry.accountId && (
                            <motion.p
                              initial={{
                                opacity: 0,
                                height: 0,
                                y: -10,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                                y: -10,
                              }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="text-destructive text-xs -mt-2 px-1 absolute left-2 -top-0 bg-white"
                              role="alert"
                            >
                              Conta duplicada
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <p className="border-t font-semibold text-end justify-end mt-2 pt-2">
              Total: {formatarMoeda(total)}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
