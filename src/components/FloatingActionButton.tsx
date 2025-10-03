"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Plus,
  Home,
  User,
  Settings,
  Mail,
  Heart,
  Search,
  ClipboardList,
  BookPlus,
  BookMinus,
} from "lucide-react";
// Import shadcn/ui Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RadialMenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  className?: string;
}

interface FloatingActionButtonProps {
  items?: RadialMenuItem[];
  className?: string;
  size?: "sm" | "md" | "lg";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  startAngle?: number;
  endAngle?: number;
}

export function FloatingActionButton({
  items = fabPresets.accounting,
  className,
  size = "md",
  position = "bottom-right",
  startAngle = -90,
  endAngle = 270,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // --- (Size and position classes remain the same) ---
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  };
  const itemSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  };
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  const tooltipSideMap = {
    "bottom-right": "left",
    "bottom-left": "right",
    "top-right": "left",
    "top-left": "right",
  } as const;

  const getItemPosition = (index: number, total: number) => {
    const angleRange = endAngle - startAngle;
    let angle: number;
    if (total > 1) {
      angle = startAngle + (index * angleRange) / (total - 1);
    } else {
      angle = startAngle + angleRange / 2;
    }
    const radius = size === "sm" ? 70 : size === "md" ? 80 : 90;
    const radian = (angle * Math.PI) / 180;
    const x = Math.round(Math.cos(radian) * radius);
    const y = Math.round(Math.sin(radian) * radius);
    return {
      transform: `translate(${x}px, ${y}px)`,
      transitionDelay: `${index * 50}ms`,
    };
  };

  const handleMainClick = () => {
    setIsOpen(!isOpen);
  };

  // Wrap the entire component in a TooltipProvider
  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("fixed z-50", positionClasses[position], className)}>
        {/* Radial Menu Items with Tooltips */}
        {items.map((item, index) => {
          const ItemIcon = item.icon;
          const shouldShow = isOpen;

          return (
            <div
              key={index}
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out",
                shouldShow ? "scale-100 opacity-100" : "scale-0 opacity-0",
              )}
              style={
                shouldShow
                  ? getItemPosition(index, items.length)
                  : { transform: "translate(0, 0)" }
              }
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95",
                      "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
                      "border border-gray-200 dark:border-gray-600",
                      itemSizes[size],
                      item.className,
                    )}
                  >
                    <ItemIcon className={iconSizes[size]} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8}>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}

        {/* Main FAB Button with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleMainClick}
              className={cn(
                "relative z-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300",
                "bg-primary text-white",
                "hover:scale-110 active:scale-95",
                sizeClasses[size],
              )}
            >
              <Plus
                className={cn(
                  "text-primary-foreground transition-transform duration-300",
                  isOpen ? "rotate-45" : "rotate-0",
                  iconSizes[size],
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSideMap[position]} sideOffset={8}>
            <p>{!isOpen ? "Mais opções" : "Fechar menu"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

// ... (fabPresets remain the same)
export const fabPresets = {
  social: [
    { icon: Heart, label: "Curtir", onClick: () => console.log("Curtir") },
    {
      icon: Mail,
      label: "Compartilhar",
      onClick: () => console.log("Compartilhar"),
    },
    { icon: User, label: "Perfil", onClick: () => console.log("Perfil") },
    { icon: Search, label: "Buscar", onClick: () => console.log("Buscar") },
  ],
  navigation: [
    { icon: Home, label: "Início", onClick: () => console.log("Início") },
    { icon: User, label: "Perfil", onClick: () => console.log("Perfil") },
    {
      icon: Settings,
      label: "Configurações",
      onClick: () => console.log("Configurações"),
    },
    { icon: Mail, label: "Mensagens", onClick: () => console.log("Mensagens") },
  ],
  accounting: [
    {
      icon: ClipboardList,
      label: "Novo Lançamento",
      onClick: () => console.log("Novo Lançamento"),
      className:
        "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300",
    },
    {
      icon: BookPlus,
      label: "Adicionar Conta Contábil",
      onClick: () => console.log("Adicionar Conta Contábil"),
      className:
        "bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-300",
    },
    {
      icon: BookMinus,
      label: "Excluir Conta Contábil",
      onClick: () => console.log("Excluir Conta Contábil"),
      className: "bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-300",
    },
  ],
};
