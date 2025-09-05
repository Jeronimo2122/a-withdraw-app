"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Character {
  name: string
  personality: string
  description: string
  avatar: string
}

interface CharacterDetailsProps {
  character: Character
  onClose: () => void
}

export default function CharacterDetails({ character, onClose }: CharacterDetailsProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4 max-w-md w-full">
          <Avatar className="h-36 w-36">
            <AvatarImage 
              src={character.avatar} 
              alt={character.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.style.visibility = 'hidden';
              }}
            />
            <AvatarFallback className="text-3xl font-semibold">
              {character.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-4 w-full">
            <div>
              <h3 className="text-xl font-semibold">{character.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{character.personality}</p>
            </div>
            <div className="text-left">
              <h4 className="font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{character.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <Button 
          className="w-full bg-black text-white hover:bg-black/90"
          onClick={onClose}
        >
          Back
        </Button>
      </div>
      <div className="h-3"></div>
    </div>
  )
} 