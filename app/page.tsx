"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Store, Trash2 } from "lucide-react"
import CharacterSettings from "@/components/character-settings"
import CharacterDetails from "@/components/character-details"
import { useToast } from "@/components/ui/use-toast"
import { useWorldIDVerification } from "@/hooks/useWorldIDVerification"
import ReactMarkdown from "react-markdown"

interface Character {
  name: string
  personality: string
  description: string
  riddle: string
  avatar: string
}

export default function CharacterChatPage() {
  const [character, setCharacter] = useState<Character>({
    name: "KAEL",
    personality: "Meticulous, calculating, philosophical, a very bad villian.",
    description: "Kael is a supernatural entity that enjoys playing with people's lives, You'll need to find the correct answer to save your life",
    riddle: `You're the owner of a misterious mansion and a person that enjoys to presence conflicts and play pshicollogically with your victims.
     In this case, you'll play with the user that is the victim of the game you created, you want to purpose the user a game in order to stress him and enjoy with him problems.
     There is a group of six university friends: Markus (the protagonist, the user), John, Oliver, Sophia, Emma, and Charlotte. 
     They rented your mansion to throw a party in the early morning hours along with many other people, but you know that one of them is planning to murder the others that night. 
     At exactly 3 a.m., Markus, the protagonist (the user), goes to the bathroom while the rest are having fun in the main hall. 
     At that moment, the lights go out for a minute. Everyone runs in panic as screams are heard, when the lights come back on, John, one of the six friends, is found dead with a knife wound.
    Your henchmen knock everyone unconscious and make them wake up in a locked room. Oliver, Sophia, Emma, and Charlotte are standing in front of Markus, who has been given a gun with a single bullet.
    You let Markus know that one of them is hiding the knife and will kill everyone—including markus—if he doesn't guess who the traitor is and shoot them. The user (Markus) must solve the mystery and decide who to shoot.
    You are free to decide the rest of the history details, please set up details and hints that allow to deduce who is the murder, you can decide other non related details in order to confuse markus
    Your job is to stress Markus, and ask him who to shot, confuse markus asking if he is absolutely sure, you can provide more details to markus in order to help him decide who is the murder but never tell the response or make the answer obvious. 
    `,
    avatar: "https://i.postimg.cc/NMX5W51F/Kael.jpg?height=40&width=40",
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showCharacterDetails, setShowCharacterDetails] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)

  const {
    isVerified,
    isLoading: isVerifying,
    error: verificationError,
    triggerVerification,
    clearVerification
  } = useWorldIDVerification({
    persistVerification: true,
  })

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
    setMessages
  } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "system" as const,
        content: `You are ${character.name}. Respond as if you are this character with the following personality traits: ${character.personality}. Keep responses concise and in character. 
        You will have a role in a history that contains a riddle, at the begging you must introduce yourself, the history and the riddle no matter what the first prompt is 
        (but you can select what language use based in the user first prompt, despite of that, just use that language withouth tell the user something related to the languaje), 
        and then you should ask the user to solve the riddle.
        You can't tell the user the answer but you can ocassionally provide the user with small hints only if you see it is neccesary through the conversation.
        Once the user answer and the history is finished, you can keep talking with the user keeping your personality but don't tell the user anything related to continue the conversation, just answer if the user keeps interacting, 
        and think in way consistent with the history to keep interacting with the user if needed. 
        This is the history and the riddle: ${character.riddle}`,
      },
    ],
    onError: (error) => {
      console.error("Chat error:", error)
      setApiError(error.message)
      toast({
        title: "Error",
        description: "Failed to get a response. Please check your API key configuration.",
        variant: "destructive",
      })
    },
  })

  // Asegurar que el mensaje del sistema siempre esté presente
  useEffect(() => {
    const systemMessage = {
      id: "1",
      role: "system" as const,
      content: `You are ${character.name}. Respond as if you are this character with the following personality traits: ${character.personality}. Keep responses concise and in character. 
      You will have a role in a history that contains a riddle, at the begging you must introduce yourself, the history and the riddle no matter what the first prompt is (but you can select what language use based in the user first prompt), and then you should ask the user to solve the riddle.
      You can't tell the user the answer but you can ocassionally provide the user with small hints only if you see it is neccesary through the conversation. Once the user answer and the history is finished, you can keep talking with the user keeping your personality. 
      This is the history and the riddle: ${character.riddle}`,
    }

    if (messages.length === 0 || messages[0].role !== "system") {
      setMessages([systemMessage])
    } else if (messages[0].content !== systemMessage.content) {
      setMessages([systemMessage, ...messages.slice(1)])
    }
  }, [character, messages, setMessages])

  // Optimized scroll handling
  useEffect(() => {
    if (!isScrolling && messagesEndRef.current) {
      const scrollArea = scrollAreaRef.current
      if (scrollArea) {
        const isAtBottom = scrollArea.scrollHeight - scrollArea.scrollTop <= scrollArea.clientHeight + 100
        if (isAtBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  }, [messages, isScrolling])

  // Handle scroll events
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      const isAtBottom = scrollArea.scrollHeight - scrollArea.scrollTop <= scrollArea.clientHeight + 100
      setIsScrolling(!isAtBottom)
    }
  }

  const handleVerifyBeforeSend = async (): Promise<boolean> => {
    if (isVerified) return true
    return await triggerVerification(character.name)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const verified = await handleVerifyBeforeSend()
    if (verified) handleSubmit(e)
  }

  const displayMessages = messages.filter((m) => m.role !== "system")

  const handleCharacterSelect = (newCharacter: Character) => {
    setCharacter(newCharacter)
    setShowSettings(false)
    setShowCharacterDetails(false)
    setMessages([])
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50">
      <Card className="w-screen h-screen flex flex-col rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle 
            className="text-2xl font-bold cursor-pointer"
            onClick={() => {
              setShowSettings(false)
              setShowCharacterDetails(false)
            }}
          >
            {showSettings ? "Character Store" : "Character Chat"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setShowSettings(!showSettings)
                if (showSettings) {
                  setShowCharacterDetails(false)
                }
              }} 
              aria-label="Character Store"
              className="hover:bg-accent/50 active:bg-accent/70"
            >
              <Store className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMessages([])} 
              aria-label="Delete Chat"
              className="hover:bg-accent/50 active:bg-accent/70"
            >
              <Trash2 className="h-5 w-5 text-black-500" />
            </Button>
          </div>
        </CardHeader>

        {showSettings ? (
          <CharacterSettings 
            character={character} 
            setCharacter={handleCharacterSelect} 
            onClose={() => {
              setShowSettings(false)
              setShowCharacterDetails(false)
            }} 
            setMessages={setMessages}
          />
        ) : showCharacterDetails ? (
          <CharacterDetails character={character} onClose={() => setShowCharacterDetails(false)} />
        ) : (
          <>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="p-2 border-b">
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 active:bg-accent/70 p-1 rounded-lg transition-colors"
                  onClick={() => setShowCharacterDetails(true)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={character.avatar} 
                      alt={character.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.style.visibility = 'hidden';
                      }}
                    />
                    <AvatarFallback className="text-sm font-semibold">
                      {character.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold">{character.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {character.personality}
                    </p>
                  </div>
                </div>
              </div>
              <ScrollArea 
                ref={scrollAreaRef}
                className="h-[calc(100%-120px)] px-4 pt-4"
                onScroll={handleScroll}
              >
                <div className="space-y-4 pb-4">
                  {apiError && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                      <p className="font-medium">Error connecting to OpenAI</p>
                      <p>{apiError}</p>
                    </div>
                  )}
                  {verificationError && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                      <p className="font-medium">Verification Error</p>
                      <p>{verificationError}</p>
                    </div>
                  )}
                  {displayMessages.length === 0 && !isChatLoading ? (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-center text-gray-500">
                      <p>Start a conversation with {character.name}!</p>
                    </div>
                  ) : (
                    displayMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={message.role === "user" ? "/placeholder.svg?height=40&width=40" : character.avatar} 
                              alt={message.role === "user" ? "User" : character.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.style.visibility = 'hidden';
                              }}
                            />
                            <AvatarFallback className="text-xs font-semibold">
                              {message.role === "user" ? "U" : character.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`prose prose-sm sm:prose-base max-w-full dark:prose-invert rounded-lg px-3 py-2 break-words text-sm sm:text-base ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {(isChatLoading || isVerifying) && (
                    <div className="flex justify-start">
                      <div className="flex flex-row items-start gap-2 max-w-[80%]">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={character.avatar} 
                            alt={character.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.style.visibility = 'hidden';
                            }}
                          />
                          <AvatarFallback className="text-xs font-semibold">
                            {character.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-4 py-2 bg-muted">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="border-t p-4">
              <form onSubmit={handleFormSubmit} className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={handleInputChange}
                  className="flex-1"
                  disabled={isChatLoading || isVerifying}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isChatLoading || isVerifying || !input.trim()}
                  className="hover:bg-primary/90 active:bg-primary/80"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </CardFooter>
            <div className="h-3"></div>
          </>
        )}
      </Card>
    </div>
  )
}