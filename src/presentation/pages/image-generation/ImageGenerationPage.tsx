
import { imageGenerationUseCase } from "../../../core/use-cases";
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

export const ImageGenerationPage = () => {

  const [isLoading, setisLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])

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
                alt= { message.info!.alt } /> ) 
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
  )
}
