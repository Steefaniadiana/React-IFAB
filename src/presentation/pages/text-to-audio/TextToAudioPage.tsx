import { textToAudioUseCase } from "../../../core/use-cases";
import { GptMessage, GptMessageAudio, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components"
import { useState } from "react";


const disclaimer = `### Ya puedes crear tu audio churri.
* El audio será generado por AI, corazón`;

const voices = [
{ id: "nova", text: "Nova" },
{ id: "alloy", text: "Alloy" },
{ id: "echo", text: "Echo" },
{ id: "fable", text: "Fable" },
{ id: "onyx", text: "Onyx" },
{ id: "shimmer", text: "Shimmer" },
]; 

interface TextMessage {
  text:string; 
  isGPT: boolean; 
  type: 'text';

}
interface AudioMessage {
  text:string; 
  isGPT: boolean; 
  type: 'audio';
  audio: string;
  
}

type Message  = TextMessage | AudioMessage; 

export const TextToAudioPage = () => {

  const [isLoading, setisLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async( text: string, selectedVoice: string) => {
    
    setisLoading(true); 
    
    setMessages( prev => [ ...prev, { text: text, isGPT: false, type: 'text' } ] );

  const { ok, message, audioUrl } = await textToAudioUseCase (text, selectedVoice);

    setisLoading(false);
    if (!ok) return; 

    setMessages( prev => [ ...prev, { text: `${ selectedVoice } - ${ message }`, isGPT: true, type: 'audio', audio: audioUrl! } ] );

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
         <GptMessage text= { disclaimer } />

         {
          messages.map( (message, index) => (
            message.isGPT 
            ? message.type === 'audio' 
                ? (<GptMessageAudio 
                  key={ index }
                  text={ message.text }
                  audio={ message.audio }/>)
                  : (<GptMessage key={ index }  text={ message.text }/>)

            :(< MyMessage key={ index } text={ message.text } />)

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

      <TextMessageBoxSelect
      onSendMessage={ handlePost }
      placeHolder="Escribe aquí wapo"
      options= {voices} />
      
    </div>
  )
}
