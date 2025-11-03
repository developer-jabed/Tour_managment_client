import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SingleImageUploader from "@/components/SingleImageUploader";
import { useAddDivisionMutation } from "@/redux/features/division/division.api";
import { toast } from "sonner";

export function AddDivisionModal() {
  const [divisionName, setDivisionName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [addDivision] = useAddDivisionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!divisionName) {
      toast.error("Division name is required");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", divisionName);
    formData.append("image", image);

    try {
      const res = await addDivision(formData).unwrap();
      if (res.success) {
        toast.success("Division added successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add division");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Division</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add New Division</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Division Name</Label>
            <Input
              placeholder="Enter division name"
              value={divisionName}
              onChange={(e) => setDivisionName(e.target.value)}
            />
          </div>

          <div>
            <Label>Division Image</Label>
            <SingleImageUploader onChange={setImage} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
