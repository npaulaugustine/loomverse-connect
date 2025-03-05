
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EditableTranscript, TranscriptSegment } from '../recording/types';
import { removeFillerWords, processVariables } from '@/services/ai-service';
import { Loader2, Check, Edit, Trash2, Variable, Wand2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranscriptEditorProps {
  transcript: EditableTranscript;
  onTranscriptChange: (transcript: EditableTranscript) => void;
}

const TranscriptEditor: React.FC<TranscriptEditorProps> = ({ 
  transcript, 
  onTranscriptChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarValue, setNewVarValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (transcript.editedText) {
      setEditableText(transcript.editedText);
    } else {
      setEditableText(transcript.originalText);
    }
  }, [transcript]);

  const handleSaveEdit = () => {
    const updatedTranscript: EditableTranscript = {
      ...transcript,
      editedText: editableText
    };
    onTranscriptChange(updatedTranscript);
    setIsEditing(false);
    toast({
      title: "Transcript Edited",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleRemoveFillerWords = async () => {
    setIsProcessing(true);
    try {
      const cleanedTranscript = await removeFillerWords(transcript);
      onTranscriptChange(cleanedTranscript);
      setEditableText(cleanedTranscript.editedText || cleanedTranscript.originalText);
      toast({
        title: "Filler Words Removed",
        description: "Transcript has been cleaned up.",
      });
    } catch (error) {
      console.error("Error removing filler words:", error);
      toast({
        title: "Processing Error",
        description: "Failed to remove filler words.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddVariable = () => {
    if (!newVarKey.trim()) return;
    
    setVariables(prev => ({
      ...prev,
      [newVarKey]: newVarValue
    }));
    
    setNewVarKey('');
    setNewVarValue('');
    
    toast({
      title: "Variable Added",
      description: `Added variable {{${newVarKey}}}`,
    });
  };

  const handleApplyVariables = async () => {
    setIsProcessing(true);
    try {
      const text = transcript.editedText || transcript.originalText;
      const processedText = await processVariables(text, variables);
      
      const updatedTranscript: EditableTranscript = {
        ...transcript,
        editedText: processedText
      };
      
      onTranscriptChange(updatedTranscript);
      setEditableText(processedText);
      
      toast({
        title: "Variables Applied",
        description: "Your variables have been applied to the transcript.",
      });
    } catch (error) {
      console.error("Error applying variables:", error);
      toast({
        title: "Processing Error",
        description: "Failed to apply variables.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetTranscript = () => {
    setEditableText(transcript.originalText);
    onTranscriptChange({
      ...transcript,
      editedText: undefined
    });
    toast({
      title: "Transcript Reset",
      description: "Transcript has been reset to the original.",
    });
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Transcript Editor</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isProcessing}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveFillerWords}
            disabled={isProcessing}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Remove Filler Words
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetTranscript}
            disabled={isProcessing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
      
      {isProcessing && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
          <p>Processing transcript...</p>
        </div>
      )}
      
      {isEditing ? (
        <>
          <Textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            className="min-h-[200px]"
            placeholder="Edit your transcript here..."
          />
          <Button onClick={handleSaveEdit} disabled={isProcessing}>
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </>
      ) : (
        <div className="bg-muted/20 p-4 rounded-md max-h-[300px] overflow-y-auto">
          {(transcript.editedText || transcript.originalText).split('\n').map((paragraph, i) => (
            <p key={i} className="mb-2">{paragraph}</p>
          ))}
        </div>
      )}
      
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Variable className="h-4 w-4" />
          Variables
        </h4>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {Object.entries(variables).map(([key, value]) => (
            <div key={key} className="flex items-center bg-muted/30 rounded p-2 text-sm">
              <span className="font-mono text-primary">{{"{{"}{key}{"}}"}}}</span>
              <span className="mx-2">=</span>
              <span className="truncate">{value}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-auto"
                onClick={() => {
                  const newVars = {...variables};
                  delete newVars[key];
                  setVariables(newVars);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-[1fr_2fr_auto] gap-2 mb-3">
          <Input
            placeholder="Variable name"
            value={newVarKey}
            onChange={(e) => setNewVarKey(e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Variable value"
            value={newVarValue}
            onChange={(e) => setNewVarValue(e.target.value)}
            className="text-sm"
          />
          <Button onClick={handleAddVariable} disabled={!newVarKey.trim()}>
            Add
          </Button>
        </div>
        
        <Button 
          onClick={handleApplyVariables} 
          variant="outline" 
          className="w-full"
          disabled={Object.keys(variables).length === 0 || isProcessing}
        >
          Apply Variables to Transcript
        </Button>
      </div>
    </div>
  );
};

export default TranscriptEditor;
