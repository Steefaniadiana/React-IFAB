import { imageGenerationUseCase, imageVariationUseCase } from "../../../core/use-cases";
import { GptMessage, GptMessageImage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { useState } from "react";

interface Message {
  text:string; 
  isGPT: boolean; 
  info?: {
  imageUrl: string;
  alt: string;
  }

}

export const ImageTunningPage = () => {

  const [isLoading, setisLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined
  });

  const handleVariation = async() => {
    setisLoading(true);

    const resp = await imageVariationUseCase( originalImageAndMask.original! );
    
    setisLoading(false);

    if ( !resp ) return; 
    setMessages( prev => [ ...prev, { text: 'Variacion', isGPT: true, info: {
      imageUrl: resp.url,
      alt: resp.alt
    } } ]);

  }

  const handlePost = async(text: string) => {
    
    setisLoading(true); 
    
    setMessages( prev => [ ...prev, { text:text, isGPT: false } ] );

    const imageInfo = await imageGenerationUseCase( text );

    setisLoading(false);

    if ( !imageInfo ) {
      setMessages( prev => [ ...prev, { text: 'Te has quedado sin saldo churri', isGPT: true } ])
    }

    setMessages( prev => [ ...prev, { text: text, isGPT: true, info: {
      imageUrl: imageInfo!.url,
      alt: imageInfo!.alt
    } } ])
  
  }

  return (
    <>
    {
      originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-6 right-6 z-10 fade-in">
          <span>Editando churri</span>
          <img src={ originalImageAndMask.original } className="border rounded-xl w-36 h-36 object-contain"></img>
          <button onClick={ handleVariation } className="btn-primary mt-2">Crear Variacion</button>
        </div>
      )
    }
      <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
         <GptMessage text= "Que imagen quieres crear churri?"/>

         {
          messages.map( (message, index) => (
            message.isGPT 
            ? ( <GptMessageImage 
                key= { index }
                text= { message.text }
                imageUrl= { message.info!.imageUrl }
                alt= { message.info!.alt } 
                onImageSelected={ url => setOriginalImageAndMask({
                  original: url,
                  mask: undefined,
                }) }/> ) 
            : ( <MyMessage  key={ index } text={ message.text }/> )
          ) )
         }

         {
          isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )

         }

        </div>
      </div>

      <TextMessageBox
      onSendMessage={ handlePost }
      placeHolder="Escribe aquí wapo"
      disableCorrections= {true} />
      
    </div> 
    </>
    
  )
}
