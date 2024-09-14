package com.project.tobe.util.constants;

public enum YesNo {

    Y('Y'),
    N('N');

    private final char value;

    YesNo(char value) {
        this.value = value;
    }

    public char getValue() {
        return value;
    }

}

