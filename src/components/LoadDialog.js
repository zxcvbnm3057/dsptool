import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { loadRequireData, deleteRequireData } from "../dataStore";
import { Base64 } from "js-base64";
import copy from "copy-to-clipboard";

const pako = require("pako");

export default function LoadDialog({ open, onClose }) {
  const dispatch = useDispatch();
  const saveData = useSelector((state) => state.saveData, shallowEqual);

  const [current, setCurrent] = React.useState();
  const [alertOpen, setAlertOpen] = React.useState(false);

  return (
    <Dialog sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }} maxWidth='xs' open={open} onClose={onClose}>
      <DialogTitle>载入方案</DialogTitle>
      <DialogContent dividers>
        {Object.keys(saveData).length ? (
          <RadioGroup
            name='load'
            value={current}
            onChange={(event) => {
              setCurrent(event.target.value);
            }}>
            {Object.keys(saveData).map((option) => (
              <FormControlLabel value={option} key={option} control={<Radio />} label={option}></FormControlLabel>
            ))}
          </RadioGroup>
        ) : (
          <Box>无方案</Box>
        )}
      </DialogContent>
      <Collapse in={alertOpen}>
        <Alert
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setAlertOpen(false);
              }}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          sx={{ mb: 2 }}>
          分享链接已复制到剪切板
        </Alert>
      </Collapse>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(deleteRequireData(current));
          }}
          disabled={!saveData[current]}>
          删除方案
        </Button>
        <Button
          onClick={() => {
            copy(
              window.location.origin +
                window.location.pathname +
                "?scheme=" +
                Base64.fromUint8Array(
                  pako.deflateRaw(JSON.stringify({ name: current, data: saveData[current] }), {
                    level: 9,
                  }),
                  true
                )
            );
            setAlertOpen(true);
          }}
          disabled={!saveData[current]}>
          导出方案
        </Button>
        <Button autoFocus onClick={onClose}>
          取消
        </Button>
        <Button
          onClick={() => {
            dispatch(loadRequireData(current));
            onClose();
          }}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
