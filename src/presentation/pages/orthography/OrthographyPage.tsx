import { MyMessage } from "../../components/bubbles/MyMessage"
import { GptMessage, GptOrthographyMessage, TextMessageBox,  TypingLoader } from "../../components"
import { useState } from "react";
import { orthographyUseCase } from "../../../core/use-cases";

interface Message {
  text:string; 
  isGPT: boolean; 
  info?: {
    userScore: number,
    errors: string[],
    message: string,
  }
}


export const OrthographyPage = () => {

  const [isLoading, setisLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async(text: string) => {
    
    setisLoading(true); 
    
    setMessages( prev => [ ...prev, { text:text, isGPT: false } ] )

    const { ok, errors, message, userScore } = await orthographyUseCase(text);

if (!ok)  {
  setMessages( prev => [ ...prev, { text: 'Churri que no va', isGPT: true } ] )
} else {
  setMessages( prev => [ ...prev, { text: message, isGPT: true, info: {errors, message, userScore} } ] )
}

    setisLoading(false);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
         <GptMessage text= "Holi churrii"/>

         {
          messages.map( (message, index) => (
            message.isGPT 
            ? (<GptOrthographyMessage key={ index } errors={ message.info!.errors } message={message.info!.message} userScore={message.info!.userScore}/> )
            : (<MyMessage  key={ index } text={ message.text }/> )
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
      disableCorrections={true}
      /> 

     {/*} <TextMessageBoxFile
      onSendMessage={ handlePost }
      placeholder="Escribe aquí wapo"/>

     <TextMessageBoxSelect
      onSendMessage={ handlePost }
      options={[{id: '1', text: 'Hola'}, {id:'2', text: 'Mundo'}]}
        placeholder="Escribe aquí wapo"/>*/}
      
    </div>
  )
}
