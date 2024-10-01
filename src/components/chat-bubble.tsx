import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Message } from "ai/react";
import { formattedText } from "@/lib/utils";

interface ChatBubbleProps extends Partial<Message> {
  sources: string[];
}

export function ChatBubble({ role = "assistant", content, sources }: ChatBubbleProps) {
  if (!content) {
    return null;
  }

  return (
    <div>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle className={
            role !== "assistant" ? "text-amber-500 dark:text-amber-200" : "text-blue-500 dark:text-blue-200"
          }>
            {role === "assistant" ? "AI" : "You"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ReactMarkdown>{content}</ReactMarkdown>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full">
            {sources && sources.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                {sources.map((source, index) => (
                  <AccordionItem value={`source-${index}`} key={index}>
                    <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
                    <AccordionContent>
                      <ReactMarkdown>{formattedText(source)}</ReactMarkdown>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}