"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Input, Password } from "rizzui";
import { ProgressBar } from "@/components/progressBar";
import { formatPhone, unmaskPhone } from "@/utils/format";
import { createUser, findUserByEmail } from "@/store/user";
import toast from "react-hot-toast";
import { routes } from "@/config/route";

interface IFormInputs {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

type Params = {
  slug: string;
};

const schema = yup.object().shape({
  username: yup.string().required("Link Bio é obrigatório"),
  name: yup.string().required("Nome completo é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  password: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "As senhas devem coincidir")
    .required("Confirmação de senha é obrigatória"),
});

const Index: React.FC<{ params: Params }> = ({ params }) => {
  const router = useRouter();

  const Defaultvalues = {
    username: params.slug,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<IFormInputs>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: Defaultvalues,
  });

  const phone = watch("phone");

  const onSubmitForm = async (data: IFormInputs) => {
    const user = await findUserByEmail(data.email);

    if (user) {
      toast.error("E-mail já cadastrado. Por favor, utilize outro e-mail!");
      return;
    }

    const formatedPhone = unmaskPhone(data.phone);

    const createdUser = await createUser({
      ...data,
      phone: formatedPhone,
      username: data.username.toLowerCase(),
    });
    reset();

    router.push(`${routes.customAvatar(createdUser.id)}`);
  };

  return (
    <div className="container mx-auto md:max-w-4xl max-w-ful">
      <header className="flex flex-col items-center justify-center">
        <header className="mt-20">
          <div>
            <img
              src="../../../img/assets/agro.page.white.png"
              alt=""
              className="h-8 object-cover"
            />
          </div>
        </header>
      </header>

      {/* <div>
        <ProgressBar progress="100%" />
      </div> */}

      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="mt-10 px-4 space-y-5 "
      >
        <Input
          {...register("username")}
          className="text-white "
          value={`agro.page/${params.slug}`}
          placeholder="Link Bio"
          error={errors.username?.message}
          autoComplete="off"
          disabled
        />
        <Input
          {...register("name")}
          placeholder="Nome completo"
          className=" text-white"
          error={errors.name?.message}
          autoComplete="off"
        />
        <Input
          {...register("email")}
          placeholder="E-mail"
          className=" text-white"
          error={errors.email?.message}
          type="email"
          autoComplete="off"
        />

        <Input
          value={phone || ""}
          placeholder="Telefone"
          autoComplete="off"
          className=" text-white"
          error={errors.phone?.message}
          onChange={(e) => {
            const formatted = formatPhone(e.target.value);
            setValue("phone", formatted, { shouldValidate: true });
          }}
        />

        <Password
          {...register("password")}
          placeholder="Senha"
          className=" text-white"
          error={errors.password?.message}
          autoComplete="new-password"
        />

        <Password
          {...register("passwordConfirmation")}
          placeholder="Confirmar Senha"
          className=" text-white"
          error={errors.passwordConfirmation?.message}
          autoComplete="off"
        />

        <div className="text-white mt-12 flex items-center justify-end w-full">
          <Button color="secondary" type="submit" className="w-full md:w-auto">
            Avançar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Index;
