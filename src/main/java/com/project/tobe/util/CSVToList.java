package com.project.tobe.util;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class CSVToList {
    public static List<List<String>> csvConvertToList(InputStream inputStream) throws CsvValidationException, IOException {
        Reader reader = new InputStreamReader(inputStream);
        CSVReader csvReader = new CSVReader(reader);

        List<List<String>> list = new ArrayList();
        String[] line;
        while ((line = csvReader.readNext()) != null) {
            // Assuming CSV columns match YourEntity fields
            list.add(Arrays.stream(line).collect(Collectors.toList()));
        }
        return list;
    }
}
