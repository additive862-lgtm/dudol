import { auth } from "@/auth";
import ProfileForm from "./ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto max-w-2xl py-20 px-4">
            <ProfileForm initialUser={session.user} />
        </div>
    );
}
