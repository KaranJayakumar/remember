import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogContent,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useState } from "react";
export const ConnectionForm = () => {
  const [connectionName, setConnectionName] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          className="flex-row items-center justify-center"
        >
          <Text>Create a Connection</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Connection</DialogTitle>
        </DialogHeader>
        <Input value={connectionName} onChangeText={setConnectionName} />
        <DialogFooter>
          <DialogClose asChild>
            <Button>
              <Text>OK</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
