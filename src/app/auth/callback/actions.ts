"use server";

import prisma from "@/db/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function checkAuthStatus() {
	console.log("hereeeee")
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user) return { success: false };

	const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
	// const referralId = generateUniqueReferralId(); // Implement your own logic
	// sign up
	if (!existingUser) {
		console.log("here")
		await prisma.user.create({
			data: {
				id: user.id,
				email: user.email!,
				name: user.given_name + " " + user.family_name,
				image: user.picture,
				referralId: "default-referral-id",
			},
		});
	}

	return { success: true };
}
