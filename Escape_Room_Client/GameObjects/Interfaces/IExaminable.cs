﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Escape_Room_Client.GameObjects
{
    public interface IExaminable
    {
        public int ExamineState { get; set; }

        public List<string> ExamineResults { get; set; }

        public void OnExamine();

    }
}
