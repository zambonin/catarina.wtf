#!/usr/bin/env awk -f

BEGIN {
  FS = ","
  print "export const cities = ["
}

NR > 1 {
  print "  { \"code\": " $1 ", \"name\": \"" $2 "\",\n" ,
      "   \"lat\": " $3 ", \"lon\": " $4 ", },"
}

END {
  print "];"
}
