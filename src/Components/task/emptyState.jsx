"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare, Plus } from "lucide-react";

export function EmptyState({ onCreateTask }) {
  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <CheckSquare className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Get started by creating your first task. Stay organized and boost your productivity!
        </p>
        <Button onClick={onCreateTask} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Your First Task
        </Button>
      </CardContent>
    </Card>
  );
}
