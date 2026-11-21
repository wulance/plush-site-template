"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface Inquiry {
  /** The id of the design the visitor is asking about, or "" for a design of their own. */
  product: string;
  setProduct: (id: string) => void;
}

const InquiryContext = createContext<Inquiry>({ product: "", setProduct: () => {} });

/** Lets any "ask about this design" link choose the design in the inquiry form further down the page. */
export function InquiryProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState("");
  return <InquiryContext.Provider value={{ product, setProduct }}>{children}</InquiryContext.Provider>;
}

export function useInquiry() {
  return useContext(InquiryContext);
}
