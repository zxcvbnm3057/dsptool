import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import * as React from 'react';
import factoryData from '../data.json';
import Cell from './Cell';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { globalSettingChanged } from '../dataStore';
import Detail from './Detail';
import SaveDialog from './SaveDialog';
import LoadDialog from './LoadDialog';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import UploadIcon from '@mui/icons-material/Upload';
// import SettingsIcon from '@mui/icons-material/Settings';


const Requestions = () => {
    const dispatch = useDispatch()
    const globalSetting = useSelector((state) => state.globalSetting, shallowEqual)

    const [key, setKey] = React.useState("组件");
    const [item, setItem] = React.useState();
    const [drawerState, setDrawerState] = React.useState(false);

    const [saveDialogOpen, setSaveDialogOpen] = React.useState(false)
    const [loadDialogOpen, setLoadDialogOpen] = React.useState(false)

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerState(open);
    };

    let children = {
        "组件": factoryData.items.materials.map((row, index) => {
            return <Stack direction="row">
                {row.map((item, index) => {
                    return <Cell name={item} onClick={(event) => { toggleDrawer(true)(event); setItem(item) }}></Cell>
                })}
            </Stack>
        }), "建筑": factoryData.items.buildings.map((row, index) => {
            return <Stack direction="row">
                {row.map((item, index) => {
                    return <Cell name={item} onClick={(event) => { toggleDrawer(true)(event); setItem(item) }}></Cell>
                })}
            </Stack>
        })
    };

    return (
        <>
            <Box color="white" p="20px" sx={{ width: "fit-content" }}>
                <Box width="100%" display="inline-flex" justifyContent="space-between" alignItems="center">
                    <ToggleButtonGroup exclusive value={key} size="large" onChange={(event, newValue) => {
                        if (null != newValue) {
                            setKey(newValue)
                        }
                    }}>
                        <ToggleButton value={"组件"}>
                            <img alt="组件" src="./static/images/组件图标.png" />
                            <div style={{ color: "white" }}>{"组件"}</div>
                        </ToggleButton>,
                        <ToggleButton value={"建筑"}>
                            <img alt="建筑" src="./static/images/工厂图标.png" />
                            <div style={{ color: "white" }}>{"建筑"}</div>
                        </ToggleButton>,
                    </ToggleButtonGroup>
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <Button onClick={() => { setSaveDialogOpen(true) }}><SaveAltIcon /></Button>
                        <Button onClick={() => { setLoadDialogOpen(true) }}><UploadIcon /></Button>
                        {/* <Button><SettingsIcon /></Button> */}
                    </ButtonGroup>
                    <SaveDialog open={saveDialogOpen}
                        onClose={() => { setSaveDialogOpen(false) }} />
                    <LoadDialog open={loadDialogOpen}
                        onClose={() => { setLoadDialogOpen(false) }} />
                </Box>
                <Stack sx={{ border: "1px solid black", width: "fit-content" }}>
                    {children[key]}
                </Stack>
            </Box>

            <ThemeProvider theme={createTheme({
                palette: {
                    primary: {
                        main: '#7d7d7d',
                    }
                },
                components: {
                    MuiToggleButtonGroup: {
                        defaultProps: {
                            exclusive: true,
                        }
                    },
                    MuiToggleButton: {
                        styleOverrides: {
                            root: {
                                "color": "#7d7d7d",
                                "backgroundColor": "#1d2736",
                                "borderColor": '#7d7d7d !important',
                                '&.Mui-selected': {
                                    color: "rgb(125, 125, 125)",
                                    "background-color": "rgba(125, 125, 125, 0.28)"
                                },
                            },
                        }
                    },
                }
            })}>
                <Grid container pl="20px" spacing={2} color="white" width="780px">
                    <Grid item xs={2}>
                        <Typography>计算方式：</Typography>
                        <ToggleButton
                            selected={true}
                            onChange={() => {
                                dispatch(globalSettingChanged({ unitInSecond: !globalSetting.unitInSecond }));
                            }}
                            sx={{ width: "60px" }}                        >
                            {globalSetting.unitInSecond ? "每秒" : "每分"}
                        </ToggleButton>
                    </Grid>
                    <Grid item xs={5}>
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
                    <Grid item xs={5}>
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

                </Grid>
            </ThemeProvider>

            <Drawer
                anchor={'right'}
                open={drawerState}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        background: "#1e2938"
                    }
                }}>
                <Box p="20px" >
                    <Detail name={item} />
                </Box>
            </Drawer>
        </>
    )
}

export default Requestions;