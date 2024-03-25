import { OrthographyResponse } from "../../interfaces";

export const orthographyUseCase = async(prompt:string) => {

    try {
         const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/orthography-check`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
         });
        if (!resp.ok) throw new Error('No va churri')

        const data = await resp.json() as OrthographyResponse;
        return {
            ok: true,
            // userScore: data.userScore,
            // errors: data.errors,
            // message: data.message,
            //poner lo de arriba es lo mismo que poner tres puntos y data porque ya está declarado. se supone yo que se :)
            ...data
        }

    } catch (error) {

    
        return {
            ok:false,
            userScore: 0,
            errors: [],
            message: 'No se pudo realizar la conexion'
        }

    }
}