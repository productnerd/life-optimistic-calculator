import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Key } from "lucide-react";

interface ApiKeyDialogProps {
  apiKey: string | null;
  onApiKeyChange: (key: string | null) => void;
}

export function ApiKeyDialog({ apiKey, onApiKeyChange }: ApiKeyDialogProps) {
  const [inputKey, setInputKey] = useState(apiKey ?? "");
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Key className="h-4 w-4" />
        {apiKey ? (
          <>
            <Badge variant="secondary" className="text-xs">
              AI Connected
            </Badge>
            <span>Change API key</span>
          </>
        ) : (
          <>
            <span>Add Claude API key for smart price estimates</span>
            <Badge variant="outline" className="text-xs">
              Optional
            </Badge>
          </>
        )}
      </button>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-amber-500" />
          AI-Powered Price Estimates
        </CardTitle>
        <CardDescription>
          Add your Claude API key to get accurate price estimates for cars,
          homes, and more. Without a key, we'll use reasonable defaults.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-sm">
            Anthropic API Key
          </Label>
          <Input
            id="api-key"
            type="password"
            placeholder="sk-ant-..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your key is stored locally in your browser and never sent to our
            servers. It's only used for direct API calls to Anthropic.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              onApiKeyChange(inputKey || null);
              setIsOpen(false);
            }}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          {apiKey && (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => {
                onApiKeyChange(null);
                setInputKey("");
                setIsOpen(false);
              }}
            >
              Remove Key
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
