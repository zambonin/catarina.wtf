SHAPER = ./mapshaper
OUTPUT_DIR = .
UF = SC
RAW_DATA = $(OUTPUT_DIR)/$(UF)_Municipios_2021.zip
SRC_SHP = $(RAW_DATA:.zip=.shp)
SRC_DBF = $(RAW_DATA:.zip=.dbf)
SRC_CSV = $(RAW_DATA:.zip=.csv)
SRC_JS = ../../src/data.js

all: gen-svg $(SRC_JS)

gen-svg: split
	$(SHAPER) -i $(OUTPUT_DIR)/*.geojson \
		-o $(OUTPUT_DIR) format=svg -quiet

$(SRC_JS): $(SRC_CSV) /usr/bin/awk
	awk -f csv-to-js.awk $< > $@

# add latitude and longitude of each city to calculate distance
# remove unneeded data
$(SRC_CSV): $(SRC_SHP) $(SHAPER) /usr/bin/docker
	$(SHAPER) -quiet -i $(SRC_SHP) \
		-each 'LAT=this.centroidX, LON=this.centroidY' -points x=LAT y=LON \
		-drop fields=SIGLA,AREA_KM2 \
		-o $(OUTPUT_DIR) format=csv

split: $(SRC_SHP) $(SRC_DBF) $(SHAPER) /usr/bin/docker
	$(SHAPER) -quiet -i $(SRC_SHP) \
		name='' -split CD_MUN -simplify 10% \
		-o $(OUTPUT_DIR) format=geojson extension=.geojson

%.shp: %.zip /usr/bin/unzip
	unzip $< $(notdir $@) -d $(OUTPUT_DIR)
	touch $@

%.dbf: %.zip /usr/bin/unzip
	unzip $< $(notdir $@) -d $(OUTPUT_DIR)
	touch $@

$(SHAPER): /usr/bin/docker
	docker build . -t mapshaper:latest

# https://ibge.gov.br/geociencias/organizacao-do-territorio/estrutura-territorial/15774-malhas.html
$(RAW_DATA): /usr/bin/curl
	curl https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_municipais/municipio_2021/UFs/$(UF)/$(UF)_Municipios_2021.zip -o $@

clean:
	@$(RM) $(SRC_SHP) $(SRC_DBF) $(SRC_CSV) $(SRC_JS) \
		$(wildcard $(OUTPUT_DIR)/*.geojson) \
		$(wildcard $(OUTPUT_DIR)/*.svg)
