"use client";

import { useEffect, useState } from "react";

import { CardModal } from "@/components/modals/card-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // this useEffect and if clause insure that this component along with everything inside is only rendered on the client because useEffect can only be rendered on the client.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // So, unless isMounted() has been turned to "true" by the initial mount from useEffect it will not be rendered and thus will not be craeting any inconsistencies when it comes to server and client, preventing hydration errors.
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CardModal />
    </>
  );
};
