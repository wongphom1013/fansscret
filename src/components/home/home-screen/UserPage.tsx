"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Post as PostType, Prisma, User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Heart,
  ImageIcon,
  LockKeyholeIcon,
  MessageCircle,
  Trash,
} from "lucide-react";
import { CldVideoPlayer } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  commentOnPostAction,
  deletePostAction,
  likePostAction,
} from "./actions";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Comment from "./Comment";

type PostWithComments = Prisma.PostGetPayload<{
  include: {
    comments: {
      include: {
        user: true;
      };
    };
    likesList: true;
  };
}>;

const UserPage = ({
  style,
  onClick,
  post,
  isSubscribed,
  admin,
  id
}: {
  style : any;
	onClick: any;
  post: any;
  isSubscribed: boolean;
  admin: any;
  id: number;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const { user } = useKindeBrowserClient();
  const router = useRouter()


  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: deletePost } = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: async () => await deletePostAction(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleClick = ()=>{
	router.push(`/messages/${id}`)
  }

  return (
    <div style={style}  onClick={handleClick} className="flex flex-col gap-3 p-3 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post?.image || "/user-placeholder.png"}
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm md:text-md">{post?.name}</span>
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-zinc-400 text-xs md:text-sm tracking-tighter">
            17.06.2024
          </p>
        </div>
      </div>
    </div>
  );
};
export default UserPage;
