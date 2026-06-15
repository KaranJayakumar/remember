import { CircleUser } from "lucide-react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

interface ProfileImageProps {
  imageUri?: string | null;
  size?: number;
  className?: string;
}

export function ProfileImage({ imageUri, size = 96, className }: ProfileImageProps) {
  return (
    <Avatar
      className={cn("rounded-full", className)}
      style={{ width: size, height: size }}
    >
      {imageUri ? (
        <AvatarImage
          source={{ uri: imageUri }}
          className="aspect-square size-full"
          style={{ width: size, height: size }}
        />
      ) : null}
      <AvatarFallback
        className="bg-secondary flex size-full flex-row items-center justify-center rounded-full"
        style={{ width: size, height: size }}
      >
        <CircleUser
          size={size * 0.67}
          className="text-muted-foreground"
          strokeWidth={1.5}
        />
      </AvatarFallback>
    </Avatar>
  );
}
