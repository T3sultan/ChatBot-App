import React ,{Component} from 'react';
import {View,Image,Text,SafeAreaView} from "react-native";
import {GiftedChat} from "react-native-gifted-chat";
import {DialogFlow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from "./env";
const botAvatar=require('./assets/images/onboarding-img2.png')

const BOT ={
  _id:2,
  name:'Mr.Bot',
  avatar:botAvatar,
}

class App extends Component {
  state={
    messages:[{_id:2,text:"My name is Tipu ",createAt:new Date(),user:BOT},
      {_id:1,text:'Hi',createAt:new Date(),user:BOT}],
    id:1,
    name:'',
  }
  componentDidMount(){
    DialogFlow_V2.setConfiguration (
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      DialogFlow_V2,
      dialogflowConfig.project_id,
    );
  }
  handleGoogleResponse(result){
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  sendBotResponse(text){
    let msg ={
      _id:this.state.messages.length+1,
      text,
      createAt:new Date(),
      user:BOT
    }
    this.setState((previouseState)=>({
      messages:GiftedChat.append(previouseState.
        messages,[msg]),

    }));
  }


  onSend(messages=[]){
    this.setState((previouseState)=>({
      messages: GiftedChat.append(previouseState.
        messages, messages)
    }))

    let message = messages[0].text;
    DialogFlow_V2.requsetQuery(
      message,
      (result)=>this.handleGoogleResponse(result),
      (error)=>console.log(error)
    )
  }
  onQuickReply(quickReply){

    this.setState((previouseState)=>({
      messages: GiftedChat.append(previouseState.
        messages, quickReply)
    }))

    let message =quickReply[0].value;
    DialogFlow_V2.requsetQuery(
      message,
      (result)=>this.handleGoogleResponse(result),
      (error)=>console.log(error)
    )
  }


  render(){
    return(
     <View style={{flex:1,backgroundColor:"#fff"}}>
       <GiftedChat 
       messages={this.state.messages}
       onSend={(message)=>this.onSend(message)}
       onQuickReply={(quickReply)=>this.onQuickReply(quickReply)}
       user={{_id:1}}

       />
     </View>
    )
  }
}
export default App;