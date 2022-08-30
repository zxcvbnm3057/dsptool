import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useDispatch } from "react-redux";
import { saveRequireData } from "../dataStore";

export default function SaveDialog({ open, onClose }) {
  const dispatch = useDispatch();
  const textFieldRef = React.useRef();

  return (
    <Dialog fullWidth={true} maxWidth={"xs"} open={open} onClose={onClose}>
      <DialogTitle>保存</DialogTitle>
      <DialogContent>
        <DialogContentText>方案名称</DialogContentText>
        <TextField
          inputRef={textFieldRef}
          autoFocus
          margin='dense'
          id='name'
          fullWidth
          variant='standard'
          autoComplete='off'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={() => {
            dispatch(saveRequireData(textFieldRef.current.value));
            onClose();
          }}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
