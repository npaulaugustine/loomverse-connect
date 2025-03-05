
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, PencilLine, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateAutoTitle, generateSummary } from '@/services/ai-service';

interface AutoMetadataGeneratorProps {
  transcription: string;
  currentTitle: string;
  currentDescription: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

const AutoMetadataGenerator: React.FC<AutoMetadataGeneratorProps> = ({
  transcription,
  currentTitle,
  currentDescription,
  onTitleChange,
  onDescriptionChange
}) => {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const { toast } = useToast();

  const handleGenerateTitle = async () => {
    if (!transcription) {
      toast({
        title: "No Transcription",
        description: "Cannot generate a title without a transcription.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingTitle(true);
    try {
      const suggestedTitle = await generateAutoTitle(transcription);
      setTitle(suggestedTitle);
      onTitleChange(suggestedTitle);
      toast({
        title: "Title Generated",
        description: "AI has suggested a title based on your content.",
      });
    } catch (error) {
      console.error("Error generating title:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate a title.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!transcription) {
      toast({
        title: "No Transcription",
        description: "Cannot generate a summary without a transcription.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingSummary(true);
    try {
      const summary = await generateSummary(transcription);
      setDescription(summary);
      onDescriptionChange(summary);
      toast({
        title: "Summary Generated",
        description: "AI has created a summary based on your content.",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate a summary.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSaveTitle = () => {
    onTitleChange(title);
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    onDescriptionChange(description);
    setIsEditingDescription(false);
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold mb-4">Auto-Generate Metadata</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Video Title</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingTitle(!isEditingTitle)}
                disabled={isGeneratingTitle}
              >
                <PencilLine className="h-4 w-4 mr-2" />
                {isEditingTitle ? "Cancel" : "Edit"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateTitle}
                disabled={isGeneratingTitle || !transcription}
              >
                {isGeneratingTitle ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </div>
          </div>
          
          {isEditingTitle ? (
            <div className="flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title..."
              />
              <Button onClick={handleSaveTitle}>
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          ) : (
            <div className="p-2 bg-muted/20 rounded">
              {title || "No title set"}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Video Description</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingDescription(!isEditingDescription)}
                disabled={isGeneratingSummary}
              >
                <PencilLine className="h-4 w-4 mr-2" />
                {isEditingDescription ? "Cancel" : "Edit"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary || !transcription}
              >
                {isGeneratingSummary ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </div>
          </div>
          
          {isEditingDescription ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description..."
                className="min-h-[100px]"
              />
              <Button onClick={handleSaveDescription} className="self-end">
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          ) : (
            <div className="p-2 bg-muted/20 rounded min-h-[60px]">
              {description || "No description set"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoMetadataGenerator;
