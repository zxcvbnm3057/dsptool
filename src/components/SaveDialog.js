import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { saveRequireData } from "../dataStore";

export default function SaveDialog({ open, onClose }) {
  const dispatch = useDispatch();
  const saveData = useSelector((state) => state.saveData, shallowEqual);

  const [text, setText] = React.useState();

  return (
    <Dialog fullWidth={true} maxWidth={"xs"} open={open} onClose={onClose}>
      <DialogTitle>保存</DialogTitle>
      <DialogContent>
        <DialogContentText>方案名称</DialogContentText>
        <TextField
          value={text}
          autoFocus
          margin='dense'
          id='name'
          fullWidth
          variant='standard'
          autoComplete='off'
          error={Object.keys(saveData).includes(text)}
          onChange={(event) => {
            setText(event.target.value);
          }}
          helperText={Object.keys(saveData).includes(text) ? "方案名重复，保存将覆盖旧方案" : null}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={() => {
            dispatch(saveRequireData(text));
            onClose();
          }}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
