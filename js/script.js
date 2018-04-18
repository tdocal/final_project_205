require ([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/widgets/ScaleBar",
            "esri/widgets/Home",
            "esri/widgets/Legend",
            "dojo/domReady!"
        ], function(
            Map,
            MapView,
            FeatureLayer,
            ScaleBar,
            Home,
            Legend
        ) {
            var map = new Map({
                basemap: "topo"
            });           
                
            var view = new MapView ({ 
                map: map,
                center: [-105.60, 40.25],
                zoom: 9,
                container: "viewDiv",
               /* extent: {
                    xmin: -11887504,
                    ymin: 4777124,
                    xmax: -11678831,
                    ymax: 5009552,
                    spatialReference: {
                        wkid: 102100
                    }
            }*/
            });
            
            //Remove default zoom buttons from upper left of map
            view.ui.remove("zoom");
            
            //Create scale bar in lower left showing both english and metric units
            var scaleBar = new ScaleBar({
                view: view,
                unit: "dual"
            });
            
            view.ui.add(scaleBar, {
                position: "bottom-left"
            });                       
            
            //Add home button to reset view to original extent after the map has been panned or zoomed
            var homeButton = new Home({
                view: view
            });
            
            view.ui.add(homeButton, "top-right");
            
            //Popup box settings, moved to upper left by default
            view.popup.dockEnabled = true;
            view.popup.dockOptions = {
                buttonEnabled: false,
                breakpoint: false,
                position: "top-left",
                autoCloseEnabled: true
            };
            
            //Create symbols that are rendered based on PARK_NAME field from the database
            var bouldSym = {
                type: "picture-marker",
                url: "http://static.arcgis.com/images/Symbols/Basic/RedStickpin.png",
                width: "30px",
                height: "30px",
                angle: 30
            };
            
            var sulphSym = {
                type: "picture-marker",
                url: "http://static.arcgis.com/images/Symbols/Basic/OrangeStickpin.png",
                width: "30px",
                height: "30px",
                angle: 30
            };
            
            var canSym = {
                type: "picture-marker",
                url: "http://static.arcgis.com/images/Symbols/Basic/YellowStickpin.png",
                width: "30px",
                height: "30px",
                angle: 30
            };
            
            var rmnpTrailsSym = {
                type: "picture-marker",
                url: "http://static.arcgis.com/images/Symbols/Basic/PurpleStickpin.png",
                width: "30px",
                height: "30px"
            };
            
            var rmnpSym = {
                type: "picture-marker",
                url: "http://static.arcgis.com/images/Symbols/Basic/BlueStickpin.png",
                width: "30px",
                height: "30px",
                angle: 30
            };
            
            var defaultSym = {
                type: "picture-marker",
                url: "http://static.arcgis.com/images/Symbols/Basic/BlackStickpin.png",
                width: "30px",
                height: "30px",
                angle: 30 
            };
            
            var symRenderer ={
                type: "unique-value",
                defaultSymbol: defaultSym,
                defaultLabel: "No Park Defined",
                field: "PARK_NAME",
                uniqueValueInfos: [{
                    value: "Boulder Ranger District",
                    symbol: bouldSym
                }, {
                    value: "Sulphur Ranger District",
                    symbol: sulphSym
                }, {
                    value: "Canyon Lakes Ranger District",
                    symbol: canSym
                }, {
                    value: "Rocky Mountain National Park Trails",
                    symbol: rmnpTrailsSym
                }, {
                    value: "Rocky Mountain National Park",
                    symbol: rmnpSym
                }]
            };
    
            var bouldBorder = {
                type: "simple-fill",
                color: [228, 26, 28, 0],
                outline: {
                    color: [228, 26, 28, 1],
                    width: 2
                }
            };
            
            var sulphBorder = {
                type: "simple-fill",
                color: [255, 127, 0, 0],
                outline: {
                    color: [255, 127, 0, 1],
                    width: 2
                }
            };
    
            var canBorder = {
                type: "simple-fill",
                color: [255, 255, 51, 0],
                outline: {
                    color: [255, 255, 51, 1],
                    width: 2
                }
            };
            
            var rmnpTrailsBorder = {
                type: "simple-fill",
                color: [152, 78, 163, 0],
                outline: {
                    color: [152, 78, 163, 1],
                    width: 2
                }
            };
            
            var rmnpBorder = {
                type: "simple-fill",
                color: [77, 175, 74, 0],
                outline: {
                    color: [77, 175, 74, 1],
                    width: 2
                }
            };
    
            /*var defaultBorder = {
                type: "simple-fill",
                color: [255, 255, 255, 1],
                legendOptions: {
                    showLegend: "false"
                },
                outline: {
                    color: "brown",
                    width: 2
                }
            };*/
            
            var borderRenderer = {
                type: "unique-value",
                //defaultSymbol: defaultBorder,
                valueExpressionTitle: " ",
                field: "PARKNAME",
                uniqueValueInfos: [{
                    value: "Boulder Ranger District",
                    symbol: bouldBorder,
                }, {
                    value: "Sulphur Ranger District",
                    symbol: sulphBorder
                }, {
                    value: "Canyon Lakes Ranger District",
                    symbol: canBorder
                }, {
                    value: "Rocky Mountain National Park Trails",
                    symbol: rmnpTrailsBorder
                }, {
                    value: "Rocky Mountain",
                    label: "Rocky Mountain National Park",
                    symbol: rmnpBorder
                }]
            };
            
            //Create the layer showing the park boundaries, if the boundaries change a new service url may be needed to display the correct borders            
            /*var parksLayer = new FeatureLayer({
                url: "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_ForestSystemBoundaries_01/MapServer/1",
                //definitionExpression: "FORESTNAME = Arapaho and Roosevelt National Forests"
            });
            map.add(parksLayer);*/
    
            var rmnpLayer = new FeatureLayer({
                url:"https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/RMNC_Project/FeatureServer/2",
                renderer: borderRenderer,
                outFields: ["PARKNAME"]
            });
            map.add(rmnpLayer);
            
            
            //Add database to the map, change this url if the location of the database service layer changes
            var trailPoints= new FeatureLayer({
                url: "https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/Trail_Coordinates_PEP1/FeatureServer/0",
                renderer: symRenderer,
                
                //Popup uses the NAME field for the title and DESCRIPTION field to display the work bring done at each site
                //Also displays an image based on the url provided in the IMG_URL field
                popupTemplate: {
                    title: "{NAME}",
                    content: [{
                        type: "text",
                        text: "{DESCRIPTION}"
                        }, {                        
                        type: "media",
                        mediaInfos: [{
                            type: "image",
                            value: {
                                sourceURL: "{IMG_URL}"
                            }
                        }]
                    }],
                },
                outFields: ["*"],
            });
            map.add(trailPoints);
            view.whenLayerView(trailPoints).then(setupHoverTooltip);
    
            //Display a legend in the lower left showing the park boundary colors
            var legend = new Legend({
                view: view,
                layerInfos:[{
                /*    layer: bouldLayer,
                    title: "Boulder Ranger District"
                }, {
                    layer: sulphurLayer,
                    title: "Sulphur Ranger District"
                }, {
                    layer: canyonLayer,
                    title: "Canyon Lakes Ranger District"
                }, {*/
                    layer: rmnpLayer,
                    title: "District Boundaries"
                }]
            });
            
            view.ui.add(legend, "bottom-right");
            
            //Create a Tooltip that displays the name of the trail when the mouse hosvers over a point on the map
            function setupHoverTooltip(layerview) {
                var promise;
                var highlight;
                                
                var tooltip = createTooltip();
                view.on("pointer-move", function(event) {
                    if (promise) {
                        promise.cancel();
                    }
                    promise = view.hitTest(event.x, event.y)
                        .then(function(hit) {
                            promise = null;
                        
                        if (highlight) {
                                highlight.remove();
                                highlight = null;
                            }

                        var results = hit.results.filter(function(result) {
                            return result.graphic.layer === trailPoints;
                        });
                        if (results.length) {
                            var graphic = results[0].graphic;
                            var screenPoint = hit.screenPoint;
                            
                            highlight = layerview.highlight(graphic);
                            tooltip.show(screenPoint, graphic.getAttribute("NAME"));
                        } else {
                            tooltip.hide();
                        }
                    });
                });
            }
                        
            function createTooltip() {
                var tooltip = document.createElement("div");
                var style = tooltip.style;
                
                tooltip.setAttribute("role", "tooltip");
                tooltip.classList.add("tooltip");
                
                var textElement = document.createElement("div");
                textElement.classList.add("esri-widget");
                tooltip.appendChild(textElement);
                
                view.container.appendChild(tooltip);
                
                var x = 0;
                var y = 0;
                var targetX = 0;
                var targetY = 0;
                var visible = false;
            
                function move() {
                    x += (targetX - x) * 0;
                    y += (targetY - y) * 0.1;

                    /*if (Math.abs(targetX - x) < 1 && Math.abs(targetY - y) < 1) {
                    x = targetX;
                    y = targetY;
                  } else {
                    requestAnimationFrame(move);
                  }*/

                  style.transform = "translate3d(" + Math.round(x) + "px," + Math.round(
                    y) + "px, 0)";
                }

                return {
                  show: function(point, text) {
                    if (!visible) {
                      x = point.x;
                      y = point.y;
                    }

                    targetX = point.x;
                    targetY = point.y;
                    style.opacity = 1;
                    visible = true;
                    textElement.innerHTML = text;

                    move();
                  },

                  hide: function() {
                    style.opacity = 0;
                    visible = false;
                  }
                };
            }
        });