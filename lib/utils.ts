import { OrderStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "BGN",
  }).format(price);
};

export function createSlug(input: string): string {
  const transliterationMap: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
      'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': '',
      'ю': 'yu', 'я': 'ya', 'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
      'Е': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L',
      'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
      'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sht',
      'Ъ': 'A', 'Ь': '', 'Ю': 'Yu', 'Я': 'Ya'
  };

  const transliterated = input.split('').map(char => transliterationMap[char] || char).join('');

  return transliterated
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
}

export function replaceNewlinesWithComma(text: string) {
  const updatedText = text.replace(/\n/g, ", ");
  return updatedText;
}

export function generateOrderCode(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let orderCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderCode += characters[randomIndex];
  }

  return orderCode;
}

export const displayStatusLabel = (status: OrderStatus) => {
  const labels: { [key in OrderStatus]: string } = {
    DELIVERED: "Доставена",
    SHIPPED: "Изпратена",
    PENDING: "Изчакване",
    CANCELLED: "Отказана",
    PROCESSING: "Изпълнява се",
    RETURNED: "Върната",
    CONFIRMED: "Потвърдена",
  };
  
  return labels[status];
};