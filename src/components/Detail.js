import G6 from '@antv/g6';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { factoryLevelChanged, numberChanged, proliferatorEffectChanged, proliferatorLevelChanged, recipeChanged, roundMethodChanged } from '../dataStore';
import { roundToFix2, unitsConversion } from '../utils/calculateUtil';

const Detail = ({ name }) => {
    const dispatch = useDispatch()

    const recipeData = useSelector((state) => state.recipeData?.[name] ?? [], shallowEqual)
    const requireData = useSelector((state) => state.requireData?.[name] ?? {}, shallowEqual)
    const globalSetting = useSelector((state) => state.globalSetting, shallowEqual)

    const ref = React.useRef(null);
    const [graph, setGraph] = React.useState(null);

    React.useEffect(() => {
        setGraph(new G6.TreeGraph({
            container: ReactDOM.findDOMNode(ref.current),
            width: 200,
            height: 300,
            fitView: true,
            fitCenter: true,
            linkCenter: true,
            animate: false,
            modes: {
                default: [],
                // default: ['drag-canvas', 'zoom-canvas'],
            },
            defaultNode: {
                type: 'image',
                size: [40, 40],
                anchorPoints: [
                    [0, 0.5],
                    [1, 0.5],
                ],
                labelCfg: { style: { fill: '#ffffff' }, position: 'bottom' }
            },
            defaultEdge: {
                type: 'cubic-vertical',
                // style: {
                //     endArrow: {
                //         path: G6.Arrow.triangle(10, 20, 25),
                //         d: 25
                //     }
                // }
            },
            layout: {
                type: 'dendrogram',
                direction: 'TB', // H / V / LR / RL / TB / BT
                nodeSep: 40,
                rankSep: 100,
            },
        }));
    }, []);

    React.useEffect(() => {
        if (graph) {
            var i = 1;
            var children = [{ id: String(i++), img: "./static/images/" + name + ".png", label: String(roundToFix2(unitsConversion(requireData.n + requireData.s, globalSetting))) }];
            for (const cargo in requireData.c) {
                if (requireData.c[cargo])
                    children.push({ id: String(i++), img: "./static/images/" + cargo + ".png", label: String(roundToFix2(unitsConversion(requireData.c[cargo], globalSetting))) });
            }
            graph.clear();
            graph.read({ id: '0', img: "./static/images/" + name + ".png", label: String(roundToFix2(unitsConversion(requireData.t + requireData.s, globalSetting))), labelCfg: { position: 'top' }, children: children });
        }
    })

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={4}
            sx={{ width: "600px" }}>
            <ThemeProvider theme={createTheme({
                palette: {
                    primary: {
                        main: '#7d7d7d',
                    }
                },
                components: {
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                "& .MuiInputLabel-root": { color: '#7d7d7d' },
                                "& .MuiOutlinedInput-root": {
                                    "& > fieldset": { borderColor: "#7d7d7d" },
                                },
                                input: { color: '#7d7d7d' }
                            }
                        }
                    },
                    MuiToggleButtonGroup: {
                        defaultProps: {
                            exclusive: true,
                            size: "small"
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
                    MuiTypography: {
                        styleOverrides: {
                            root: {
                                "color": '#7d7d7d !important'
                            }
                        }
                    }
                },
            })}>
                <Grid container spacing={2} color="white">
                    <Grid item xs={4}>
                        <Typography>需求：</Typography>
                        <TextField key={name} type="number" size="small" defaultValue={unitsConversion(requireData.n, globalSetting) || ''}
                            sx={{
                                "input::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none"
                                }, width: "115px"
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">{"个/" + (globalSetting.unitInSecond ? "s" : "min")}</InputAdornment>,
                            }}
                            onBlur={(event) => { dispatch(numberChanged({ name: name, number: parseInt(event.target.value || 0) / (globalSetting.unitInSecond ? 1 : 60) })); }} />
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>工厂等级：</Typography>
                        <ToggleButtonGroup
                            value={requireData.fl}
                            onChange={(event, newValue) => {
                                if (null != newValue) {
                                    dispatch(factoryLevelChanged({ name: name, value: newValue }));
                                }
                            }}>
                            <ToggleButton value={1}>Mk.Ⅰ</ToggleButton>
                            <ToggleButton value={2} disabled={!["冶炼设备", "制造台"].includes(recipeData[requireData.i].m)}>Mk.Ⅱ</ToggleButton>
                            <ToggleButton value={3} disabled={!["制造台"].includes(recipeData[requireData.i].m)}>Mk.Ⅲ</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>增产剂效果：</Typography>
                        <ToggleButtonGroup
                            value={requireData.pe}
                            onChange={(event, newValue) => {
                                if (null != newValue) {
                                    dispatch(proliferatorEffectChanged({ name: name, value: newValue }));
                                }
                            }}>
                            <ToggleButton value={1}>加速</ToggleButton>
                            <ToggleButton value={2} disabled={recipeData[requireData.i].e}>增产</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>工厂数量：</Typography>
                        <ToggleButtonGroup
                            value={requireData.r || globalSetting.r}
                            onChange={(event, newValue) => {
                                if (null != newValue) {
                                    dispatch(roundMethodChanged({ name: name, value: newValue }));
                                }
                            }}>
                            <ToggleButton value={1}>向下取整</ToggleButton>
                            <ToggleButton value={2}>不取整</ToggleButton>
                            <ToggleButton value={3}>向上取整</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>增产剂等级：</Typography>
                        <ToggleButtonGroup
                            value={requireData.pl || globalSetting.pl}
                            onChange={(event, newValue) => {
                                if (null != newValue) {
                                    dispatch(proliferatorLevelChanged({ name: name, value: newValue }));
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
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                color="white"
                width="500px">
                {recipeData.map((recipe, id) => {
                    return <Box height="40px" display="flex" justifyContent="center" alignItems="end" bgcolor={requireData.i === id ? "#243b5c" : "transparent"} p={"5px"} sx={{ border: "2px solid #7d7d7d !important", width: "100%" }} onClick={() => dispatch(recipeChanged({ name: name, value: id }))} >
                        {Object.keys(recipe.i).map((key) =>
                            <>
                                <img alt={key} src={"./static/images/" + key + ".png"} />
                                <sub>{recipe.i[key]}</sub>
                            </>
                        )}
                        <svg height="100%" viewBox="0 0 80 65">
                            <text x="35" y="35" font-size="30" fill="#fff" style={{ "text-anchor": "middle" }}>{recipe.t}s</text>
                            <line x1="5" y1="44" x2="65" y2="44" stroke="#fff" stroke-width="2" marker-end="url(#arrow)" />
                            <path d="M65,50 L65,38 L83,44 z" fill="#fff" />
                        </svg>
                        <img alt={name} src={"./static/images/" + name + ".png"} />
                        <sub>{recipe.n}</sub>
                    </Box>
                })}
            </Stack>
            <div ref={ref}></div>
        </Stack>
    );
}

export default Detail;