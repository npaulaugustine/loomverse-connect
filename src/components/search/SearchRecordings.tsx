
import React, { useState, useEffect } from 'react';
import { Search, X, Tag, Mic, FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Recording } from '@/components/recording/types';
import { searchRecordings } from '@/services/ai-service';

interface SearchRecordingsProps {
  recordings: Recording[];
  onSearchResults: (results: Recording[]) => void;
}

const SearchRecordings: React.FC<SearchRecordingsProps> = ({ 
  recordings, 
  onSearchResults 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<'text' | 'voice'>('text');
  
  // Extract all unique tags from recordings
  useEffect(() => {
    const allTags = new Set<string>();
    recordings.forEach(rec => {
      if (rec.tags) {
        rec.tags.forEach(tag => allTags.add(tag));
      }
    });
    setAvailableTags(Array.from(allTags));
  }, [recordings]);
  
  // Perform search whenever query or selected tags change
  useEffect(() => {
    let results = recordings;
    
    // First filter by search query
    if (searchQuery.trim()) {
      results = searchRecordings(results, searchQuery);
    }
    
    // Then filter by selected tags
    if (selectedTags.length > 0) {
      results = results.filter(rec => 
        rec.tags && selectedTags.every(tag => rec.tags.includes(tag))
      );
    }
    
    onSearchResults(results);
  }, [searchQuery, selectedTags, recordings, onSearchResults]);
  
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const startVoiceSearch = () => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setSearchMode('voice');
        console.log('Voice recognition started');
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setSearchMode('text');
      };
      
      recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        setSearchMode('text');
      };
      
      recognition.onend = () => {
        setSearchMode('text');
      };
      
      recognition.start();
    } else {
      console.error('Speech recognition not supported');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, transcription, or content..."
              className="pl-9 pr-16"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className={searchMode === 'voice' ? 'bg-red-100 text-red-500' : ''}
            onClick={startVoiceSearch}
            title="Search by voice"
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Filter by tags">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <h4 className="font-medium text-sm mb-1">Filter by Tags</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Select tags to filter recordings
                </p>
              </div>
              <DropdownMenuSeparator />
              {availableTags.length === 0 ? (
                <div className="p-2 text-muted-foreground text-sm">
                  No tags available
                </div>
              ) : (
                availableTags.map(tag => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedTags.map(tag => (
            <div 
              key={tag}
              className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs"
            >
              <Tag className="h-3 w-3" />
              {tag}
              <button 
                onClick={() => toggleTag(tag)}
                className="ml-1 hover:text-primary-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setSelectedTags([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchRecordings;
