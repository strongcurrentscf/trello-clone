"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CreateBoard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: "Missing fields, failed to create board.",
    };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
      },
    });

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return { error: "Failed to create." };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);

// REVIEW: Primative Server Actions
// import { z } from "zod";
// import { revalidatePath } from "next/cache";

// import { db } from "@/lib/db";
// import { redirect } from "next/navigation";

// export type State = {
//   errors?: {
//     title?: string[];
//   };
//   message?: string | null;
// };

// const CreateBoard = z.object({
//   title: z
//     .string()
//     .min(3, { message: "Minimum length of 3 letters is required" }),
// });

// export async function create(prevState: State, formData: FormData) {
//   const validatedFields = CreateBoard.safeParse({
//     title: formData.get("title"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Missing fields.",
//     };
//   }

//   const { title } = validatedFields.data;

//   try {
//     await db.board.create({
//       data: {
//         title,
//       },
//     });
//   } catch (error) {
//     return {
//       message: "Database Error",
//     };
//   }

//   revalidatePath("/organization/org_2nZrxsUfVHz81nSbsTidkee5t0J");
//   redirect("/organization/org_2nZrxsUfVHz81nSbsTidkee5t0J");
// }
