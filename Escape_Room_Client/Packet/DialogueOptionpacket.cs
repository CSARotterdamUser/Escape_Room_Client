namespace Escape_Room_Client.Packet
{
    public class DialogueOptionpacket
    {
        public string OptionText { get; set; }

        public string nextDialogueText { get; set; }

        public string FunctionID { get; set; }
    }
}