
import { audioToTextUseCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TextMessageBoxFile, TypingLoader } from "../../components"
import { useState } from "react";

interface Message {
  text:string; 
  isGPT: boolean; 

}

export const AudioToTextPage = () => {

  const [isLoading, setisLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])


  const handlePost = async(text: string, audioFile: File) => {
    
    setisLoading(true); 
    
    setMessages( prev => [ ...prev, { text:text, isGPT: false } ] );


    const resp = await audioToTextUseCase( audioFile, text ); 

    setisLoading(false);

    if (!resp ) return; 

    const gptMessage = `
## Transcripción:
**Duración:** *${ Math.round(resp.duration ) }*
## El texto es: 
${ resp.text }
    `;
  setMessages( prev => [
    ...prev, 
    {text: gptMessage, isGPT: true }
  ]);

  for ( const segment of resp.segments ){
    const segmentMessage = `
*de ${ Math.round(segment.start )} a ${ Math.round( segment.end )} segundos:*
${ segment.text }
    `;

    setMessages( prev => [
      ...prev, 
      {text: segmentMessage, isGPT: true }
    ]);
  }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
         <GptMessage text= "Holi churrii, que audio te da pereza escuchar y/o prefieres leer?"/>

         {
          messages.map( (message, index) => (
            message.isGPT 
            ? (<GptMessage key={ index } text={ message.text } /> )
            : (<MyMessage  key={ index } text={ message.text ===''
              ? ' Transcribe el audio'
              : message.text}
           />)
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

      <TextMessageBoxFile
      onSendMessage={ handlePost }
      placeHolder="Escribe aquí wapo"
      disableCorrections= {true} 
      accept= "audios/**"/>
      
    </div>
  )
}
