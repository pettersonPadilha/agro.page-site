"use client";

import { api } from "@/service/api";
import { useCallback, useEffect, useState } from "react";
import { UserBio } from "@/components/user-bio";
import { Loader } from "rizzui";
import { User } from "@/types/user";
import { SharedBio } from "@/components/modal/shared-bio";

interface Props {
  params: { slug: string };
}

export default function Page({ params }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const getDataApiByUsername = useCallback(async () => {
    setLoading(true);
    const response = await api.get("/users/username", {
      params: { username: params.slug.toLocaleLowerCase() },
    });

    setUser(response.data);
    setLoading(false);
  }, [params.slug]);

  useEffect(() => {
    getDataApiByUsername();
  }, [getDataApiByUsername]);

  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <Loader color="secondary" size="lg" />
        </div>
      ) : (
        <div>
          <UserBio user={user} />
        </div>
      )}
    </>
  );
}
