import SaveAltIcon from "@mui/icons-material/SaveAlt";
import UploadIcon from "@mui/icons-material/Upload";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import factoryData from "../data.json";
import { globalSettingChanged, readRequireData, resetRequireData } from "../dataStore";
import Cell from "./Cell";
import Detail from "./Detail";
import LoadDialog from "./LoadDialog";
import SaveDialog from "./SaveDialog";
// import SettingsIcon from '@mui/icons-material/Settings';
import { Base64 } from "js-base64";

const pako = require("pako");
const queryString = require("query-string");

const Requestions = (props) => {
  const dispatch = useDispatch();
  const globalSetting = useSelector((state) => state.globalSetting, shallowEqual);

  const [key, setKey] = React.useState("组件");
  const [item, setItem] = React.useState();
  const [drawerState, setDrawerState] = React.useState(false);

  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = React.useState(false);
  const [readDialogOpen, setReadDialogOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerState(open);
  };

  let children = {
    组件: factoryData.items.materials.map((row, index) => {
      return (
        <Stack direction='row'>
          {row.map((item, index) => {
            return (
              <Cell
                name={item}
                onClick={(event) => {
                  toggleDrawer(true)(event);
                  setItem(item);
                }}></Cell>
            );
          })}
        </Stack>
      );
    }),
    建筑: factoryData.items.buildings.map((row, index) => {
      return (
        <Stack direction='row'>
          {row.map((item, index) => {
            return (
              <Cell
                name={item}
                onClick={(event) => {
                  toggleDrawer(true)(event);
                  setItem(item);
                }}></Cell>
            );
          })}
        </Stack>
      );
    }),
  };

  var schemeQuery = queryString.parse(window.location.search)["scheme"];
  var scheme = schemeQuery ? JSON.parse(pako.inflateRaw(Base64.toUint8Array(schemeQuery), { to: "string" })) : null;

  React.useEffect(() => {
    if (scheme) {
      setReadDialogOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  return (
    <>
      <Box color='white' p='20px' sx={{ width: "fit-content" }}>
        <Box width='100%' display='inline-flex' justifyContent='space-between' alignItems='center'>
          <ToggleButtonGroup
            exclusive
            value={key}
            size='large'
            onChange={(event, newValue) => {
              if (null != newValue) {
                setKey(newValue);
              }
            }}>
            <ToggleButton value={"组件"}>
              <img alt='组件' src='./static/images/组件图标.png' />
              <div style={{ color: "white" }}>{"组件"}</div>
            </ToggleButton>
            ,
            <ToggleButton value={"建筑"}>
              <img alt='建筑' src='./static/images/工厂图标.png' />
              <div style={{ color: "white" }}>{"建筑"}</div>
            </ToggleButton>
            ,
          </ToggleButtonGroup>
          <ButtonGroup variant='outlined' aria-label='outlined button group'>
            <Button
              onClick={() => {
                setSaveDialogOpen(true);
              }}>
              <SaveAltIcon />
            </Button>
            <Button
              onClick={() => {
                setLoadDialogOpen(true);
              }}>
              <UploadIcon />
            </Button>
            {/* <Button><SettingsIcon /></Button> */}
          </ButtonGroup>
          <SaveDialog
            open={saveDialogOpen}
            onClose={() => {
              setSaveDialogOpen(false);
            }}
          />
          <LoadDialog
            open={loadDialogOpen}
            onClose={() => {
              setLoadDialogOpen(false);
            }}
          />
        </Box>
        <Stack sx={{ border: "1px solid black", width: "fit-content" }}>{children[key]}</Stack>
      </Box>

      <ThemeProvider
        theme={createTheme({
          palette: {
            primary: {
              main: "#7d7d7d",
            },
          },
          components: {
            MuiToggleButtonGroup: {
              defaultProps: {
                exclusive: true,
              },
            },
            MuiToggleButton: {
              styleOverrides: {
                root: {
                  color: "#7d7d7d",
                  backgroundColor: "#1d2736",
                  borderColor: "#7d7d7d !important",
                  "&.Mui-selected": {
                    color: "rgb(125, 125, 125)",
                    "background-color": "rgba(125, 125, 125, 0.28)",
                  },
                },
              },
            },
          },
        })}>
        <Grid container pl='20px' spacing={2} color='white' width='780px' alignItems={"flex-end"}>
          <Grid item xs='auto'>
            <Typography>计算方式：</Typography>
            <ToggleButton
              selected={true}
              onChange={() => {
                dispatch(
                  globalSettingChanged({
                    unitInSecond: !globalSetting.unitInSecond,
                  })
                );
              }}
              sx={{ width: "60px" }}>
              {globalSetting.unitInSecond ? "每秒" : "每分"}
            </ToggleButton>
          </Grid>
          <Grid item xs='auto'>
            <Typography>取整方式：</Typography>
            <ToggleButtonGroup
              value={globalSetting.r}
              onChange={(event, newValue) => {
                if (null != newValue) {
                  dispatch(globalSettingChanged({ r: newValue }));
                }
              }}>
              <ToggleButton value={1}>向下取整</ToggleButton>
              <ToggleButton value={2}>不取整</ToggleButton>
              <ToggleButton value={3}>向上取整</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs='auto'>
            <Typography>增产剂等级：</Typography>
            <ToggleButtonGroup
              value={globalSetting.pl}
              onChange={(event, newValue) => {
                if (null != newValue) {
                  dispatch(globalSettingChanged({ pl: newValue }));
                }
              }}>
              <ToggleButton value={1}>不使用</ToggleButton>
              <ToggleButton value={2}>MK.Ⅰ</ToggleButton>
              <ToggleButton value={3}>MK.Ⅱ</ToggleButton>
              <ToggleButton value={4}>MK.Ⅲ</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs='auto'>
            <ToggleButton
              selected={false}
              onChange={() => {
                dispatch(resetRequireData());
              }}
              sx={{ width: "70px" }}>
              重置
            </ToggleButton>
          </Grid>
        </Grid>
      </ThemeProvider>

      <Drawer
        anchor={"right"}
        open={drawerState}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            background: "#1e2938",
          },
        }}>
        <Box p='20px'>
          <Detail name={item} />
        </Box>
      </Drawer>

      {scheme ? (
        <Dialog
          open={readDialogOpen}
          onClose={() => {
            setReadDialogOpen(false);
          }}>
          <DialogTitle id='alert-dialog-title'>{"加载量化方案？"}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>{"加载新方案将覆盖未保存的方案，是否确定？"}</DialogContentText>
            <DialogContentText id='alert-dialog-description'>{"新方案名：" + scheme.name}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setReadDialogOpen(false);
              }}>
              取消
            </Button>
            <Button
              onClick={() => {
                dispatch(readRequireData(scheme.data));
                setReadDialogOpen(false);
              }}
              autoFocus>
              确定
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
};

export default Requestions;
