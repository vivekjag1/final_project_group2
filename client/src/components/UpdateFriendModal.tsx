interface Props{
    name:string; 
    open:boolean;
    setOpen: (state:boolean) => void; 
    deleteFriend:  (friend:string) => void; 
}
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { MakeProtectedPostRequest } from "@/utils/makeProtectedPostRequest";
import { useAuth0 } from "@auth0/auth0-react";
import { useFriendsContext } from "@/contexts/FriendsContext";
import { toast } from "sonner";
export const UpdateFriendModal = (props:Props) => { 
    const {getAccessTokenSilently} = useAuth0(); 
    const {user} = useAuth0(); 
    const {setFriends} = useFriendsContext(); 
    const [updateRelationship, setUpdatedRelationship] = useState<string>(''); 
    const handleSubmit = async(e:React.FormEvent) => { 
        e.preventDefault(); 
        const token = await getAccessTokenSilently(); 
        const toUpdate = { 
            userName: user!.name, 
            name: props.name, 
            newRelationship: updateRelationship
        }; 
        const data = await MakeProtectedPostRequest('/api/updateFriend', toUpdate, token ); 
        setFriends(data.data[0].friends)
        toast.success(`Updated ${props.name}`); 
        props.setOpen(false); 


        
    }
    return(
        <Dialog open={props.open} onOpenChange={() => props.open? props.setOpen(false): props.setOpen(true)}>

            <DialogContent>
                <DialogHeader className = "text-3xl text-center">
                    <DialogTitle className = "text-center text-2xl">{`Update ${props.name}`}</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => handleSubmit}>
                <Input placeholder={`Enter your relationship with ${props.name}`} onChange={(e) => setUpdatedRelationship(e.target.value)}/>
                <div className = "flex flex-row items-center justify-center mt-5">
                    <Button className = "mr-5 w-28" type="button" variant="destructive" onClick={() => props.deleteFriend(props.name)}>Delete Friend</Button>
                    <Button onClick = {(e) => handleSubmit(e)}className = "mr-5 w-28"> Submit</Button>
                </div>
                </form>
            </DialogContent>

        </Dialog>

    )


}