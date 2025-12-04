"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VoiceCommandsProps {
    onNextStep: () => void;
    onPreviousStep: () => void;
    onStartTimer: (minutes: number) => void;
    onPauseTimer: () => void;
}

export function VoiceCommands({ 
    onNextStep, 
    onPreviousStep, 
    onStartTimer,
    onPauseTimer 
}: VoiceCommandsProps) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const [lastCommand, setLastCommand] = useState<string>("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            
            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = true;
                recognitionInstance.interimResults = false;
                recognitionInstance.lang = 'en-US';

                recognitionInstance.onresult = (event: any) => {
                    const last = event.results.length - 1;
                    const command = event.results[last][0].transcript.toLowerCase().trim();
                    setLastCommand(command);
                    handleCommand(command);
                };

                recognitionInstance.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                recognitionInstance.onend = () => {
                    if (isListening) {
                        recognitionInstance.start();
                    }
                };

                setRecognition(recognitionInstance);
            }
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, []);

    const handleCommand = (command: string) => {
        console.log('Voice command:', command);

        // Next step commands
        if (command.includes('next') || command.includes('continue')) {
            onNextStep();
            speak('Moving to next step');
        }
        // Previous step commands
        else if (command.includes('back') || command.includes('previous')) {
            onPreviousStep();
            speak('Going back to previous step');
        }
        // Timer commands
        else if (command.includes('timer')) {
            const minutes = parseInt(command.match(/\d+/)?.[0] || '5');
            onStartTimer(minutes);
            speak(`Setting timer for ${minutes} minutes`);
        }
        else if (command.includes('pause') || command.includes('stop')) {
            onPauseTimer();
            speak('Timer paused');
        }
        // Repeat step
        else if (command.includes('repeat') || command.includes('again')) {
            speak('Repeating current step');
            // You can implement this by reading the current step
        }
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleListening = () => {
        if (!recognition) {
            alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    if (!recognition) {
        return null; // Don't show if not supported
    }

    return (
        <div className="flex items-center gap-3">
            <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                className="gap-2"
            >
                {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                {isListening ? 'Listening...' : 'Voice Control'}
            </Button>
            
            {lastCommand && (
                <Badge variant="secondary" className="text-xs">
                    "{lastCommand}"
                </Badge>
            )}

            {isListening && (
                <div className="text-xs text-muted-foreground">
                    Try: "next", "back", "timer 5", "pause"
                </div>
            )}
        </div>
    );
}
