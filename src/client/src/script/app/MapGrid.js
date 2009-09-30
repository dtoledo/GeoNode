var MapGrid = Ext.extend(Ext.grid.GridPanel, {

    
    //rest URL for getting the maps
    url: null,

    autoScroll: true,
    autoExpandColumn: 'title',
    renderTo: "map-browser",
    height: 300,

    mapGridText : "UT:Map",
    createMapText : "UT:Create Map",
    openMapText : "UT:Open Map",
    exportMapText: "UT: Export Map",
    mapTitleLabelText: "UT:Title",
    mapAbstractLabelText: "UT:Abstract",
    mapContactLabelText: "UT:Contact",
    mapTagsLabelText: "UT:Tags",
    mapLinkLabelText: "UT:View this Map",

    initComponent: function(){

        this.title = this.mapGridText;

        this.store = this.store || new Ext.data.JsonStore({
            url: this.url,
            root: 'maps',
            id: 'id', 
            fields: [
                {name: 'id', mapping: 'id'},
                {name: "title", mapping: "config.about.title"},
                {name: "tags", mapping: "config.about.tags"},
                {name: "abstract", mapping: "config.about.abstract"},
                {name: "contact", mapping: "config.about.contact"}
            ],
            autoLoad: true
        });

        if(!this.expander){

            var tpl = new Ext.Template('<p><b>' + this.mapAbstractLabelText + ':</b> {abstract}</p>'+
                                       '<p><b>' + this.mapTagsLabelText + ':</b> {tags} </p>' +
                                       '<p><a href="map.html?map={id}">' + this.mapLinkLabelText + '</a></p>');

            this.expander = new Ext.grid.RowExpander({
                tpl: tpl});	
        }

        if(!this.plugins){
            this.plugins = this.expander;
        }

        if(!this.cm){
            this.cm = new Ext.grid.ColumnModel([
                this.expander, 
                {id: 'title', header: this.mapTitleLabelText, dataIndex: 'title', sortable: true},
                {id: 'contact', header: this.mapContactLabelText, dataIndex: 'contact', width: 250, sortable: true}
            ])
        }
       
        var mapGrid = this;
        this.tbar = [
            "->",
            new Ext.Button({
                text: this.openMapText,
                iconCls: "icon-open-map",
                handler: function() {
                    var rec = mapGrid.getSelectionModel().getSelected();
                    if (rec)
                        location.href = "map.html?" + Ext.urlEncode({map: rec.id});
                }
            }),
            new Ext.Button({
                text: this.exportMapText,
                iconCls: "icon-export",
                handler: function() {
                    var rec = mapGrid.getSelectionModel().getSelected();
                    if (rec) mapGrid.showExportWizard({map: rec.id});
                }
            }),
            new Ext.Button({
                text: this.createMapText,
                iconCls: "icon-create-map",
                handler: function() {
                    location.href = "map.html"
                }
            })
        ],
        
        this.listeners = Ext.applyIf(this.listeners || {}, {
            "rowdblclick": function(grid, rowIndex, evt) {
                var rec = grid.store.getAt(rowIndex);
                if (rec != null) {
                    location.href = "map.html?" + Ext.urlEncode({map: rec.id});
                }
            }
        });
        
        MapGrid.superclass.initComponent.call(this);       
    },

    showExportWizard: function(mapid) {
        new ExportWizard(mapid).show();
    }
});

