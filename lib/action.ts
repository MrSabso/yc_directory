"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client"; // Your existing client

export const createPitch = async (state: any, form: FormData, pitch: string) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({ status: "ERROR", error: "Unauthorized" });
  }

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== 'pitch'),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    // Fetch the author document based on the user's email
    const author = await writeClient.fetch(
      `*[_type == "author" && email == $email][0]`,
      { email: session.user.email }
    );

    if (!author) {
      return parseServerActionResponse({
        error: "Author not found for the current user.",
        status: "ERROR",
      });
    }

    const startup = {
      _type: "startup",
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: author._id,
      },
      pitch,
    };

    const result = await writeClient.create(startup);

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
