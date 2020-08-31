import React from "react";
import './Game.css'
import {AuthLoginResponse, GroupJoinResponse} from "../ApiModels";
import {
    Connection_Closed_Packet,
    DeserializePacket,
    DialogueNodePacket, Group_Update_Packet, Info_Packet,
    ItemPacket,
    POIPacket, ReadySocket, Room_Packet,
    RoomPacket
} from "../../Socket/Packets";
import {
    instanceOfConnClosed,
    instanceOfGroupUpdate,
    instanceOfInfoPacket,
    instanceOfKeepAlive, instanceOfRoomPacket,
    isDialoguePacket,
    isString
} from "../Helper";
import {
    PuzzleAnswerRequest,
    UpdateItemStateRequest,
    UpdatePOIStateRequest,
    UpdateTraversableStateRequest
} from "../Requests";
import {animateScroll} from "react-scroll";

interface GameProps {
    user: AuthLoginResponse,
    group: GroupJoinResponse
    room: RoomPacket
    socket: WebSocket
}

interface GameState {
    room: RoomPacket
    POIs: Array<POIPacket>
    traversables: Array<POIPacket>
    items: Array<ItemPacket>
    inventory: Array<ItemPacket>

    MessageLog: Array<DialogueNodePacket | string>
    InputLog: Array<string>

    currentinput: string

    currentGameObject: POIPacket | undefined

    inDialogue: boolean
    exitingDialogue: boolean
    currentDialogueNode: DialogueNodePacket | undefined
    handlingExtraInput: boolean
    ExtraInputFunc: string
}

export default class GameComponent extends React.Component<GameProps, GameState> {
    private messagesEnd: HTMLDivElement | null = null;

    constructor(props: any) {
        super(props)
        this.state = {
            room: this.props.room,

            POIs: this.props.room.POIs.filter(poi => !poi.IsTraversable),
            traversables: this.props.room.POIs.filter(poi => poi.IsTraversable),
            items: this.props.room.Items,
            inventory: this.props.room.Inventory,

            MessageLog: new Array<DialogueNodePacket | string>(),
            InputLog: new Array<string>(),
            currentinput: "",

            currentGameObject: undefined,

            inDialogue: false,
            exitingDialogue: false,
            currentDialogueNode: undefined,
            handlingExtraInput: false,
            ExtraInputFunc: ""
        }

        this.props.socket.onmessage = (event: MessageEvent) => {
            console.log(event)
            this.handleMessage(event)
        }

        this.state.MessageLog.push(this.props.room.roomName)
        this.state.InputLog.push("Je bent in")

        this.addMessage = this.addMessage.bind(this)
        this.scrollToBottom = this.scrollToBottom.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.InteractPOI = this.InteractPOI.bind(this)
        this.logAll = this.logAll.bind(this)

        console.log(this.props.room.roomName)

        // this.props.room.POIs.forEach(poi => this.logAll(poi.Dialogue.Root))
    };

    private logAll(node: DialogueNodePacket) {
        console.log("ND: " + node.NextDialogueText)
        console.log("OT: " + node.OptionText)
        console.log("FID" + node.FunctionID)
        node.Children.forEach(child => this.logAll(child))
    }

    private handleMessage(event: MessageEvent) {
        if (isString(event.data)) {

            const res = DeserializePacket(event.data);

            if (res !== undefined) {
                instanceOfConnClosed(res) ? this.handleConnClosed(res)
                    : instanceOfGroupUpdate(res) ? this.handleGroupUpdate(res)
                    : instanceOfInfoPacket(res) ? this.handleInfoPacket(res)
                        : instanceOfKeepAlive(res) ? this.handleKeepAlive()
                            : instanceOfRoomPacket(res) ? this.handleRoomPacket(res)
                                : console.log(res)
            }
        } else {

        }
    }


    private handleConnClosed(packet: Connection_Closed_Packet) {
    }

    private handleGroupUpdate(packet: Group_Update_Packet) {

    }

    private handleInfoPacket(packet: Info_Packet) {
    }

    private handleRoomPacket(packet: Room_Packet) {
        this.setState({
            room: packet.packet,
            POIs: packet.packet.POIs.filter(poi => !poi.IsTraversable),
            traversables: packet.packet.POIs.filter(poi => poi.IsTraversable),
            items: packet.packet.Items,
            inventory: packet.packet.Inventory
        })
    }

    private handleKeepAlive() {
        if (this.props.socket !== undefined)
            this.props.socket.send("Alive")
    }

    public updateReady = (ready: Array<ReadySocket>) => {
    }
    private handleSubmit() {
        const input = this.state.currentinput;
        this.setState({currentinput: "", InputLog: this.state.InputLog.concat([input])})
        if (this.state.handlingExtraInput) {
            if(this.state.currentDialogueNode !== undefined &&
               this.state.ExtraInputFunc !== "") {
                this.handlePuzzleInput(this.state.ExtraInputFunc, input)
            }
            this.addMessage(
                {
                    Children: [{
                        Children: [],
                        OptionText: "Beëindig",
                        NextDialogueText: "",
                        FunctionID: "",
                        KeepOpen: false
                    }],
                    OptionText: "",
                    NextDialogueText: "^^^^ Antwoord op puzzel verzonden",
                    FunctionID: "",
                    KeepOpen: false
                }
            )
            this.setState({handlingExtraInput: false, ExtraInputFunc: ""})
        } else {
            if (this.state.exitingDialogue) {
                this.setState({
                    exitingDialogue: false,
                })
                this.setState({InputLog: this.state.InputLog.concat("Exited dialog")})
                this.addMessage(this.state.room.roomName)
            } else {
                if (this.state.inDialogue && this.state.currentDialogueNode !== undefined) {
                    const children = this.state.currentDialogueNode.Children

                    const num = Number.parseInt(input)
                    if (Number.isInteger(num)) {
                        if (num >= children.length) {
                            this.addMessage("ERR: Could not find choice with that index")

                        } else {
                            const nextNode = this.state.currentDialogueNode.Children[num]


                            if (nextNode !== undefined) {
                                this.setState({
                                    currentDialogueNode: nextNode,
                                })
                                this.addMessage(nextNode)

                                if (nextNode.FunctionID !== "" && nextNode.FunctionID !== null && nextNode.FunctionID !== undefined) {
                                    console.log(nextNode.KeepOpen)
                                    if(nextNode.KeepOpen){
                                        this.setState({handlingExtraInput: true, ExtraInputFunc: nextNode.FunctionID})
                                    }else {
                                        if (this.state.currentGameObject !== undefined) {
                                            if (this.state.currentGameObject.IsTraversable) {
                                                this.updateTraversableState(nextNode.FunctionID)
                                            } else {
                                                this.updatePoiState(nextNode.FunctionID);
                                            }

                                        }
                                    }
                                }

                                if (nextNode.Children.length === 0) {
                                    const temp = nextNode
                                    if(!nextNode.KeepOpen) {
                                        temp.Children.push({
                                            Children: [],
                                            FunctionID: "",
                                            OptionText: "Beëindig",
                                            NextDialogueText: "",
                                            KeepOpen: false,
                                        })
                                    }
                                    this.setState({
                                        exitingDialogue: true,
                                        inDialogue: false,
                                    })
                                    this.setState({InputLog: nextNode.KeepOpen ? this.state.InputLog.concat(["Waiting for input..."]) :  this.state.InputLog.concat(["Voer 0 in om door te gaan"])})
                                    this.addMessage(temp)
                                }
                            } else {
                                this.addMessage("ERR: could not read option choice from input (Je zit nog in een dialog)")
                            }
                        }

                    } else {
                        this.addMessage("ERR: could not read option choice from input (Je zit nog in een dialog)")
                    }
                } else {
                    const inputParts = input.toLocaleLowerCase().split('.')
                    switch (inputParts[0]) {
                        case("poi"):
                            //TODO: Add error handling
                            var poinum = Number.parseInt(inputParts[1])
                            if (Number.isInteger(poinum)) {
                                switch (inputParts[2]) {
                                    case("interact"):
                                        this.setState({inDialogue: true})
                                        this.InteractPOI(poinum)
                                        break
                                    case("examine"):
                                        this.addMessage(this.state.POIs[poinum].Info.Examine);
                                        break
                                    default:
                                        this.addMessage("ERR: Unknown command. Known commands: Interact, Examine")
                                }
                            } else {
                                this.addMessage(`ERR: POI with ID ${inputParts[1]} not found`)
                            }
                            break
                        case("traversable"):
                            //TODO: Add error handling
                            var travnum = Number.parseInt(inputParts[1])
                            if (Number.isInteger(travnum)) {
                                switch (inputParts[2]) {
                                    case("interact"):
                                        this.setState({inDialogue: true})
                                        this.InteractTraversable(travnum)
                                        break
                                    case("examine"):
                                        this.addMessage(this.state.traversables[travnum].Info.Examine);
                                        break
                                    default:
                                        this.addMessage("ERR: Unknown command. Known commands: Interact, Examine")
                                }
                            } else {
                                this.addMessage(`ERR: Item with ID ${inputParts[1]} not found`)
                            }
                            break
                        case("item"):
                            var itemnum = Number.parseInt(inputParts[1])
                            if (Number.isInteger(itemnum)) {
                                switch (inputParts[2]) {
                                    case("pickup"):
                                        this.pickupItem(this.state.items[itemnum].ItemName)
                                        this.addMessage(`Je hebt de ${this.state.items[itemnum].ItemName} opgepakt en in je broekzak gestopt`)
                                        break
                                    case("examine"):
                                        this.addMessage(this.state.items[itemnum].info.Examine);
                                        break
                                    default:
                                        this.addMessage("ERR: Unknown command. Known commands: Pickup, Examine")
                                }
                            } else {
                                this.addMessage(`ERR: Item with ID ${inputParts[1]} not found`)
                            }
                            break
                        case("inventory"):
                            var invnum = Number.parseInt(inputParts[1])
                            if (Number.isInteger(invnum)) {
                                switch (inputParts[2]) {
                                    case("drop"):
                                        this.dropItem(this.state.inventory[invnum].ItemName)
                                        this.addMessage(`Je hebt de ${this.state.inventory[invnum].ItemName} voorzichtig op de grond gelegd in ${this.state.room.roomName}`)
                                        break
                                    case("examine"):
                                        this.addMessage(this.state.inventory[invnum].info.Examine);
                                        break
                                    default:
                                        this.addMessage("ERR: Unknown command. Known commands: Drop, Examine")
                                }
                            } else {
                                this.addMessage(`ERR: Item with ID ${inputParts[1]} not found`)
                            }
                            break
                        default:
                            this.addMessage('ERR: Unknown command. Known commands: POI, Traversable, Item, Inventory')
                    }
                }
            }
        }
    }

    scrollToBottom() {
        animateScroll.scrollToBottom({
            containerId: "message-window"
        });
    }

    private InteractPOI(index: number) {
        var rootNode = this.state.POIs[index].Dialogue.Root;
        this.setState({currentDialogueNode: rootNode, currentGameObject: this.state.POIs[index]})
        this.addMessage(rootNode)

    }

    private InteractTraversable(index: number) {
        var rootNode = this.state.traversables[index].Dialogue.Root;
        this.setState({currentDialogueNode: rootNode, currentGameObject: this.state.traversables[index]})
        this.addMessage(rootNode)
    }

    private addMessage(message: string | DialogueNodePacket) {
        this.setState({MessageLog: this.state.MessageLog.concat([message])})
        this.render()
        this.scrollToBottom()
    }

    enterPressed(event: React.KeyboardEvent<HTMLInputElement>) {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            this.handleSubmit();
        }
    }

    public render() {
        return (
            <div className="game-container">
                <div className="game-left-container-container">
                    <p>{this.state.room.roomName}</p>
                    <div className="game-left-container">
                        <p>POIs</p>
                        <div className="interactable-container">
                            <ul>
                                {this.state.POIs.map(poi =>
                                    <div className="list-line-container">
                                        <p>[{this.state.POIs.indexOf(poi)}]</p>
                                        <li>{poi.Info.Description}</li>
                                    </div>
                                )}
                            </ul>
                        </div>
                        <p>Traversables</p>
                        <div className="interactable-container">
                            <ul>
                                {this.state.traversables.map(poi =>
                                    <div className="list-line-container">
                                        <p>[{this.state.traversables.indexOf(poi)}]</p>
                                        <li>{poi.Info.Description}</li>
                                    </div>
                                )}
                            </ul>
                        </div>
                        <p>Items in Room</p>
                        <div className="interactable-container">
                            <ul>
                                {this.state.items.map(item =>
                                    <div className="list-line-container">
                                        <p>[{this.state.items.indexOf(item)}]</p>
                                        <li>{item.ItemName}</li>
                                    </div>
                                )}
                            </ul>
                        </div>
                        <p>Inventory</p>
                        <div className="interactable-container">
                            <ul>
                                {this.state.inventory.map(item =>
                                    <div className="list-line-container">
                                        <p>[{this.state.inventory.indexOf(item)}]</p>
                                        <li>{item.ItemName}</li>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="game-right-container">
                    <div id="message-window" className="game-message-window">
                        {this.state.MessageLog.map(item =>
                            isDialoguePacket(item)
                                ? <div>
                                    <div className="dialogue-separator">
                                        <p>> {this.state.InputLog[this.state.MessageLog.indexOf(item)]}</p>
                                    </div>
                                    <div className="dialogue-frame-container">
                                        <div className="dialogue-text-container">
                                            <p>{item.NextDialogueText}</p>
                                        </div>
                                        <div className="dialogue-option-container">
                                            {item.Children.map(child =>
                                                <p>[{item.Children.indexOf(child)}] {child.OptionText}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                : <div>
                                    <div className="dialogue-separator">
                                        <p>> {this.state.InputLog[this.state.MessageLog.indexOf(item)]}</p>
                                    </div>
                                    <div className="dialogue-option-container">
                                        <p>{item}</p>
                                    </div>
                                </div>)}
                        <div style={{float: "left", clear: "both"}}
                             ref={(el) => {
                                 this.messagesEnd = el
                             }}>
                        </div>
                    </div>

                    <div className="game-input-window">
                        <span><p>></p>
                        <input
                            className="game-input-box"
                            type="text" autoComplete="true"
                            value={this.state.currentinput}
                            onChange={event => this.setState({currentinput: event.target.value})}
                            onKeyPress={this.enterPressed.bind(this)}/>
                        <button className="game-input-button" onClick={this.handleSubmit}>Send</button></span>
                    </div>
                </div>

            </div>)
    }


    private async updatePoiState(FunctionID: string) {
        const UpdateStateRequest = await UpdatePOIStateRequest(
            this.props.user.res.outcome,
            this.props.group.groupID,
            this.props.user.user.playerID,
            FunctionID)
        if (!isString(UpdateStateRequest)) {
            if (UpdateStateRequest.successful) {
                console.log("update request successful")
            } else {
                console.log(UpdateStateRequest.message)
            }
        } else {

            console.log("ERR: " + UpdateStateRequest)

        }
    }

    private async pickupItem(FunctionID: string) {
        console.log("Calling " + FunctionID)
        const UpdateStateRequest = await UpdateItemStateRequest(
            this.props.user.res.outcome,
            this.props.group.groupID,
            this.props.user.user.playerID,
            FunctionID,
            this.state.room.roomID,
            true)
        if (!isString(UpdateStateRequest)) {
            if (UpdateStateRequest.successful) {
                console.log("update request successful")
            } else {
                console.log(UpdateStateRequest.message)
            }
        } else {

            console.log("ERR: " + UpdateStateRequest)

        }
    }

    private async dropItem(FunctionID: string) {
        const UpdateStateRequest = await UpdateItemStateRequest(
            this.props.user.res.outcome,
            this.props.group.groupID,
            this.props.user.user.playerID,
            FunctionID,
            this.state.room.roomID,
            false)
        if (!isString(UpdateStateRequest)) {
            if (UpdateStateRequest.successful) {
                console.log("update request successful")
            } else {
                console.log(UpdateStateRequest.message)
            }
        } else {

            console.log("ERR: " + UpdateStateRequest)

        }
    }

    private async updateTraversableState(FunctionID: string) {
        const UpdateStateRequest = await UpdateTraversableStateRequest(
            this.props.user.res.outcome,
            this.props.group.groupID,
            this.props.user.user.playerID,
            FunctionID)
        if (!isString(UpdateStateRequest)) {
            if (UpdateStateRequest.successful) {
                console.log("traversable update request successful")
            } else {
                console.log(UpdateStateRequest.message)
            }
        } else {
            console.log("ERR: " + UpdateStateRequest)
        }
    }


    private async handlePuzzleInput(FunctionID: string, input: string) {
        console.log("Calling " + FunctionID)
        const PuzzleRequest = await PuzzleAnswerRequest(
            this.props.user.res.outcome,
            this.props.group.groupID,
            this.props.user.user.playerID,
            FunctionID,
            input,
        )
        if (!isString(PuzzleRequest)) {
            if (PuzzleRequest.successful) {
                console.log("puzzle update request successful")
            } else {
                console.log(PuzzleRequest.message)
            }
        } else {
            console.log("ERR: " + PuzzleRequest)
        }
    }
}