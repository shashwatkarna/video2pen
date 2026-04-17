"use client";
import { StackHandler } from "@stackframe/stack";
import { stack } from "@/stack";

export default function StackHandlerPage() {
  return <StackHandler app={stack} fullPage={true} />;
}
